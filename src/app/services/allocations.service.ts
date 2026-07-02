import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, QueryParams } from './api.service';
import { AllocationHistoryItem, MyAssetItem, PagedResult } from '../models/api.model';

export interface AllocationHistoryQuery {
  readonly page: number;
  readonly pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class AllocationsService {
  private readonly api = inject(ApiService);

  mineAssets(): Observable<readonly MyAssetItem[]> {
    return this.api.get<readonly MyAssetItem[]>('/api/me/assets');
  }

  history(query: AllocationHistoryQuery): Observable<PagedResult<AllocationHistoryItem>> {
    const params: QueryParams = { page: query.page, pageSize: query.pageSize };
    return this.api.get<PagedResult<AllocationHistoryItem>>('/api/allocations/history', params);
  }
}
