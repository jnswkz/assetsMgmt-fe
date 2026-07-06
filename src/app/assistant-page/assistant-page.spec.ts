import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AiAskResponse } from '../models/ai.model';
import { AuthService } from '../services/auth.service';
import { AiAssistantService } from '../services/ai-assistant.service';
import { AssistantPage } from './assistant-page';

describe('AssistantPage', () => {
  let fixture: ComponentFixture<AssistantPage>;
  let auth: AuthService;
  let assistantApi: { ask: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    assistantApi = {
      ask: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AssistantPage],
      providers: [{ provide: AiAssistantService, useValue: assistantApi }],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    window.sessionStorage.clear();
  });

  async function createPage(username = 'chloe'): Promise<HTMLElement> {
    auth.selectMockUser(username);
    fixture = TestBed.createComponent(AssistantPage);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should render the empty assistant state initially', async () => {
    const compiled = await createPage();

    expect(compiled.textContent).toContain('AI Assistant');
    expect(compiled.textContent).toContain('Start a conversation');
    expect(compiled.querySelectorAll('.message').length).toBe(0);
  });

  it('should send a first message and append the assistant response', async () => {
    assistantApi.ask.mockReturnValue(of(aiResponse()));
    const compiled = await createPage();
    const component = fixture.componentInstance as unknown as {
      updateInput(event: Event): void;
      send(): void;
    };

    component.updateInput(fakeInputEvent('Cho tôi manual của Dell XPS 13'));
    fixture.detectChanges();
    component.send();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(assistantApi.ask).toHaveBeenCalledWith({
      message: 'Cho tôi manual của Dell XPS 13',
      conversationId: null,
    });
    expect(compiled.textContent).toContain('Cho tôi manual của Dell XPS 13');
    expect(compiled.textContent).toContain('Tôi tìm thấy các tài liệu phù hợp');
  });

  it('should reuse the returned conversationId on later sends', async () => {
    assistantApi.ask
      .mockReturnValueOnce(of(aiResponse({ conversationId: 'conversation-42' })))
      .mockReturnValueOnce(of(aiResponse({ conversationId: 'conversation-42', answer: 'Follow-up answer' })));

    await createPage();
    const component = fixture.componentInstance as unknown as {
      updateInput(event: Event): void;
      send(): void;
    };

    component.updateInput(fakeInputEvent('First prompt'));
    fixture.detectChanges();
    component.send();
    await fixture.whenStable();
    fixture.detectChanges();

    component.updateInput(fakeInputEvent('Second prompt'));
    fixture.detectChanges();
    component.send();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(assistantApi.ask).toHaveBeenNthCalledWith(2, {
      message: 'Second prompt',
      conversationId: 'conversation-42',
    });
  });

  it('should render source links and quick actions from assistant replies', async () => {
    assistantApi.ask.mockReturnValue(
      of(
        aiResponse({
          suggestedActions: ['Kiểm tra trạng thái thiết bị này'],
          sources: [
            {
              title: 'Dell XPS 13 Support Documents',
              url: 'https://www.dell.com/support/home/en-us/product-support/',
              kind: 'support',
            },
          ],
        })
      )
    );

    const compiled = await createPage();
    const component = fixture.componentInstance as unknown as {
      updateInput(event: Event): void;
      send(): void;
    };

    component.updateInput(fakeInputEvent('Manual'));
    fixture.detectChanges();
    component.send();
    await fixture.whenStable();
    fixture.detectChanges();

    const quickAction = compiled.querySelector<HTMLButtonElement>('.message__actions button');
    const sourceLink = compiled.querySelector<HTMLAnchorElement>('.message__sources a');

    expect(quickAction?.textContent).toContain('Kiểm tra trạng thái thiết bị này');
    expect(sourceLink?.getAttribute('href')).toBe('https://www.dell.com/support/home/en-us/product-support/');
  });

  it('should send a suggested action immediately when clicked', async () => {
    assistantApi.ask
      .mockReturnValueOnce(of(aiResponse({ suggestedActions: ['Kiểm tra trạng thái thiết bị này'] })))
      .mockReturnValueOnce(of(aiResponse({ answer: 'Trang thai moi.' })));

    await createPage();
    const component = fixture.componentInstance as unknown as {
      updateInput(event: Event): void;
      send(): void;
      sendSuggestedAction(prompt: string): void;
    };

    component.updateInput(fakeInputEvent('Manual'));
    fixture.detectChanges();
    component.send();
    await fixture.whenStable();
    fixture.detectChanges();

    component.sendSuggestedAction('Kiểm tra trạng thái thiết bị này');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(assistantApi.ask).toHaveBeenNthCalledWith(2, {
      message: 'Kiểm tra trạng thái thiết bị này',
      conversationId: 'conversation-1',
    });
  });

  it('should restore the local transcript from sessionStorage', async () => {
    window.sessionStorage.setItem(
      'am.ai-assistant.user-chloe',
      JSON.stringify({
        conversationId: 'conversation-99',
        draft: 'unsent draft',
        messages: [
          {
            id: 'assistant-1',
            role: 'assistant',
            content: 'Stored answer',
            createdAt: '2026-07-05T00:00:00Z',
            suggestedActions: [],
            sources: [],
          },
        ],
      })
    );

    const compiled = await createPage();

    expect(compiled.textContent).toContain('Stored answer');
    expect(compiled.querySelector<HTMLTextAreaElement>('textarea')?.value).toBe('unsent draft');
  });

  it('should clear transcript and conversationId on new chat', async () => {
    assistantApi.ask.mockReturnValue(of(aiResponse()));
    const compiled = await createPage();
    const component = fixture.componentInstance as unknown as {
      updateInput(event: Event): void;
      send(): void;
      startNewConversation(): void;
    };

    component.updateInput(fakeInputEvent('Manual'));
    fixture.detectChanges();
    component.send();
    await fixture.whenStable();
    fixture.detectChanges();

    component.startNewConversation();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Start a conversation');
    const stored = JSON.parse(window.sessionStorage.getItem('am.ai-assistant.user-chloe') ?? '{}');
    expect(stored.conversationId).toBeNull();
    expect(stored.messages).toEqual([]);
  });

  it('should keep the user message visible and show an inline error on failure', async () => {
    assistantApi.ask.mockReturnValue(throwError(() => new Error('boom')));
    const compiled = await createPage();
    const component = fixture.componentInstance as unknown as {
      updateInput(event: Event): void;
      send(): void;
    };

    component.updateInput(fakeInputEvent('Laptop bị nóng'));
    fixture.detectChanges();
    component.send();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Laptop bị nóng');
    expect(compiled.textContent).toContain('The assistant is unavailable right now. Please try again.');
  });
});

function aiResponse(overrides: Partial<AiAskResponse> = {}): AiAskResponse {
  return {
    conversationId: 'conversation-1',
    intent: 'SearchManual',
    selectedTool: 'search_manual_sources',
    toolArguments: { manufacturer: 'Dell', modelQuery: 'XPS 13' },
    answer: 'Tôi tìm thấy các tài liệu phù hợp.',
    suggestedActions: [],
    sources: [],
    ...overrides,
  };
}

function fakeInputEvent(value: string): Event {
  return { target: { value } } as unknown as Event;
}
