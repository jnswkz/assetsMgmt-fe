import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, QueryParams } from './api.service';
import { DisposalDto, PagedResult } from '../models/api.model';

export interface DisposalQuery {
  readonly type?: number;
  readonly page: number;
  readonly pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class DisposalsService {
  private readonly api = inject(ApiService);

  list(query: DisposalQuery): Observable<PagedResult<DisposalDto>> {
    const params: QueryParams = {
      type: query.type,
      page: query.page,
      pageSize: query.pageSize,
    };
    return this.api.get<PagedResult<DisposalDto>>('/api/disposals', params);
  }
}
