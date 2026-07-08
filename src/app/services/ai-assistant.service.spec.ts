import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { AiAskResponse } from '../models/ai.model';
import { ApiService } from './api.service';
import { AiAssistantService } from './ai-assistant.service';

describe('AiAssistantService', () => {
  it('should post prompts to /api/ai/ask', () => {
    const response: AiAskResponse = {
      conversationId: 'conversation-1',
      intent: 'QueryMyAssets',
      selectedTool: 'get_my_assets',
      toolArguments: { scope: 'assigned_to_me' },
      answer: 'Here are your assigned assets.',
      suggestedActions: [],
      sources: [],
    };
    const api = {
      post: vi.fn(() => of(response)),
      delete: vi.fn(() => of(undefined)),
    };

    TestBed.configureTestingModule({
      providers: [
        AiAssistantService,
        { provide: ApiService, useValue: api },
      ],
    });

    const service = TestBed.inject(AiAssistantService);
    let result: AiAskResponse | undefined;

    service
      .ask({
        message: 'Tôi đang được cấp thiết bị nào?',
        conversationId: 'conversation-1',
      })
      .subscribe(value => (result = value));

    expect(api.post).toHaveBeenCalledWith('/api/ai/ask', {
      message: 'Tôi đang được cấp thiết bị nào?',
      conversationId: 'conversation-1',
    });
    expect(result).toEqual(response);

    service.confirm('action-1').subscribe();
    service.cancel('action-1').subscribe();
    expect(api.post).toHaveBeenCalledWith('/api/ai/actions/action-1/confirm');
    expect(api.delete).toHaveBeenCalledWith('/api/ai/actions/action-1');
  });
});
