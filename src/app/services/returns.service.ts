import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, QueryParams } from './api.service';
import { ResolveReturnObligationRequest, ReturnObligationDto } from '../models/api.model';

export interface ReturnObligationQuery {
  readonly includeResolved?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ReturnsService {
  private readonly api = inject(ApiService);

  list(query: ReturnObligationQuery = {}): Observable<readonly ReturnObligationDto[]> {
    const params: QueryParams = {
      includeResolved: query.includeResolved,
    };
    return this.api.get<readonly ReturnObligationDto[]>('/api/returns/obligations', params);
  }

  resolve(id: string, body: ResolveReturnObligationRequest = {}): Observable<ReturnObligationDto> {
    return this.api.post<ReturnObligationDto>(`/api/returns/obligations/${id}/resolve`, body);
  }
}
