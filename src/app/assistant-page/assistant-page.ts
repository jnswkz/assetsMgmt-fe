import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { AiAskResponse, AiPendingAction, AiSourceReference } from '../models/ai.model';
import { controlValue, matchesSearch } from '../utils/search';
import { UserMenu } from '../user-menu/user-menu';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { AiAssistantService } from '../services/ai-assistant.service';

type ChatRole = 'user' | 'assistant';

interface AssistantMessage {
  readonly id: string;
  readonly role: ChatRole;
  readonly content: string;
  readonly createdAt: string;
  readonly suggestedActions: readonly string[];
  readonly sources: readonly AiSourceReference[];
  readonly pendingAction: AiPendingAction | null;
}

interface StoredAssistantSession {
  readonly conversationId: string | null;
  readonly draft: string;
  readonly messages: readonly AssistantMessage[];
}

@Component({
  selector: 'app-assistant-page',
  imports: [MatIconModule, UserMenu],
  templateUrl: './assistant-page.html',
  styleUrl: './assistant-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantPage {
  private readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  private readonly assistant = inject(AiAssistantService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly user = this.auth.profile;
  protected readonly currentUser = this.auth.currentUser;
  protected readonly messageSearch = signal('');
  protected readonly inputText = signal('');
  protected readonly conversationId = signal<string | null>(null);
  protected readonly messages = signal<readonly AssistantMessage[]>([]);
  protected readonly isSending = signal(false);
  protected readonly busyActionId = signal<string | null>(null);
  protected readonly errorMessage = signal('');
  private readonly restoredUserId = signal<string | null>(null);

  protected readonly canSend = computed(() => this.inputText().trim().length > 0 && !this.isSending());
  protected readonly hasMessages = computed(() => this.messages().length > 0);
  protected readonly filteredMessages = computed(() =>
    this.messages().filter(message =>
      matchesSearch(this.messageSearch(), [
        message.content,
        message.suggestedActions.join(' '),
        message.sources.map(source => `${source.title} ${source.kind ?? ''}`).join(' '),
      ])
    )
  );

  constructor() {
    toObservable(this.currentUser)
      .pipe(
        map(user => user?.id ?? null),
        filter((userId): userId is string => !!userId),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(userId => this.restoreSession(userId));
  }

  protected updateSearch(event: Event): void {
    this.messageSearch.set(controlValue(event));
  }

  protected updateInput(event: Event): void {
    this.inputText.set(controlValue(event));
    this.persistSession();
  }

  protected handleComposerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  protected startNewConversation(): void {
    this.conversationId.set(null);
    this.messages.set([]);
    this.inputText.set('');
    this.errorMessage.set('');
    this.persistSession();
  }

  protected send(): void {
    this.sendPrompt(this.inputText().trim());
  }

  protected sendSuggestedAction(prompt: string): void {
    this.sendPrompt(prompt.trim());
  }

  protected confirmAction(messageId: string, action: AiPendingAction): void {
    if (this.busyActionId()) return;
    this.busyActionId.set(action.id);
    this.errorMessage.set('');
    this.assistant.confirm(action.id).subscribe({
      next: response => {
        this.messages.update(messages => messages.map(message =>
          message.id === messageId
            ? {
                ...message,
                content: response.answer,
                suggestedActions: response.suggestedActions,
                sources: safeSources(response.sources),
                pendingAction: null,
              }
            : message
        ));
        this.busyActionId.set(null);
        this.persistSession();
      },
      error: error => {
        this.errorMessage.set(actionErrorMessage(error));
        this.busyActionId.set(null);
      },
    });
  }

  protected cancelAction(messageId: string, action: AiPendingAction): void {
    if (this.busyActionId()) return;
    this.busyActionId.set(action.id);
    this.errorMessage.set('');
    this.assistant.cancel(action.id).subscribe({
      next: () => {
        this.messages.update(messages => messages.map(message =>
          message.id === messageId
            ? { ...message, content: `${message.content}\n\nAction cancelled.`, pendingAction: null }
            : message
        ));
        this.busyActionId.set(null);
        this.persistSession();
      },
      error: error => {
        this.errorMessage.set(actionErrorMessage(error));
        this.busyActionId.set(null);
      },
    });
  }

  private sendPrompt(prompt: string): void {
    if (!prompt || this.isSending()) {
      return;
    }

    const userMessage: AssistantMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
      createdAt: new Date().toISOString(),
      suggestedActions: [],
      sources: [],
      pendingAction: null,
    };

    this.messages.update(messages => [...messages, userMessage]);
    this.inputText.set('');
    this.errorMessage.set('');
    this.isSending.set(true);
    this.persistSession();

    this.assistant
      .ask({
        message: prompt,
        conversationId: this.conversationId(),
      })
      .subscribe({
        next: response => {
          this.appendAssistantResponse(response);
          this.isSending.set(false);
        },
        error: () => {
          this.errorMessage.set('The assistant is unavailable right now. Please try again.');
          this.isSending.set(false);
          this.persistSession();
        },
      });
  }

  private appendAssistantResponse(response: AiAskResponse): void {
    this.conversationId.set(response.conversationId);
    this.messages.update(messages => [
      ...messages,
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.answer,
        createdAt: new Date().toISOString(),
        suggestedActions: response.suggestedActions,
        sources: safeSources(response.sources),
        pendingAction: response.pendingAction ?? null,
      },
    ]);
    this.persistSession();
  }

  private restoreSession(userId: string): void {
    if (this.restoredUserId() === userId) {
      return;
    }

    this.restoredUserId.set(userId);

    if (!this.isBrowser) {
      return;
    }

    const session = this.readSession(userId);
    if (!session) {
      this.conversationId.set(null);
      this.messages.set([]);
      this.inputText.set('');
      this.errorMessage.set('');
      return;
    }

    this.conversationId.set(session.conversationId);
    this.messages.set(session.messages);
    this.inputText.set(session.draft);
    this.errorMessage.set('');
  }

  private persistSession(): void {
    if (!this.isBrowser) {
      return;
    }

    const userId = this.restoredUserId() ?? this.currentUser()?.id ?? null;
    if (!userId) {
      return;
    }

    const session: StoredAssistantSession = {
      conversationId: this.conversationId(),
      draft: this.inputText(),
      messages: this.messages(),
    };

    try {
      this.storage()?.setItem(this.storageKey(userId), JSON.stringify(session));
    } catch {
      // Ignore storage failures so the chat stays usable in private mode.
    }
  }

  private readSession(userId: string): StoredAssistantSession | null {
    try {
      const value = this.storage()?.getItem(this.storageKey(userId));
      if (!value) return null;
      const session = JSON.parse(value) as StoredAssistantSession;
      return {
        ...session,
        messages: session.messages.map(message => ({
          ...message,
          sources: safeSources(message.sources ?? []),
          pendingAction: message.pendingAction ?? null,
        })),
      };
    } catch {
      this.storage()?.removeItem(this.storageKey(userId));
      return null;
    }
  }

  private storageKey(userId: string): string {
    return `am.ai-assistant.${userId}`;
  }

  private storage(): Storage | null {
    if (!this.isBrowser || typeof window === 'undefined') {
      return null;
    }
    try {
      return window.sessionStorage;
    } catch {
      return null;
    }
  }
}

function safeSources(sources: readonly AiSourceReference[]): readonly AiSourceReference[] {
  return sources.filter(source => {
    try {
      const url = new URL(source.url);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
      return false;
    }
  });
}

function actionErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const detail = typeof error.error?.detail === 'string' ? error.error.detail : '';
    if (error.status === 404) return 'This action is unavailable or belongs to another user.';
    if (error.status === 409 && detail.toLowerCase().includes('expired')) return 'This action expired. Please ask the assistant again.';
    if (error.status === 409 && detail.toLowerCase().includes('executed')) return 'This action has already been executed.';
    if (error.status === 409) return detail || 'The data changed before confirmation. Please review and try again.';
  }
  return 'Unable to process this action right now.';
}
