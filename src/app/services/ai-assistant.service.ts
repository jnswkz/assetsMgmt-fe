import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AiAskRequest, AiAskResponse } from '../models/ai.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AiAssistantService {
  private readonly api = inject(ApiService);

  ask(request: AiAskRequest): Observable<AiAskResponse> {
    return this.api.post<AiAskResponse>('/api/ai/ask', request);
  }
}
