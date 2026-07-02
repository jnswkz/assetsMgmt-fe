import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, QueryParams } from './api.service';
import { DashboardStatsDto, IdleAssetItem, PagedResult } from '../models/api.model';

export interface IdleAssetQuery {
  readonly page: number;
  readonly pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly api = inject(ApiService);

  dashboard(): Observable<DashboardStatsDto> {
    return this.api.get<DashboardStatsDto>('/api/reports/dashboard');
  }

  idleAssets(query: IdleAssetQuery): Observable<PagedResult<IdleAssetItem>> {
    const params: QueryParams = { page: query.page, pageSize: query.pageSize };
    return this.api.get<PagedResult<IdleAssetItem>>('/api/reports/idle-assets', params);
  }
}
