import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, QueryParams } from './api.service';
import {
  AllocationRequestDto,
  CreateRequestDto,
  HandoverResult,
  PagedResult,
  RejectRequestDto,
  RequestListItem,
} from '../models/api.model';

export interface RequestQuery {
  readonly page: number;
  readonly pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private readonly api = inject(ApiService);

  create(body: CreateRequestDto): Observable<AllocationRequestDto> {
    return this.api.post<AllocationRequestDto>('/api/requests', body);
  }

  mine(query: RequestQuery): Observable<PagedResult<RequestListItem>> {
    return this.api.get<PagedResult<RequestListItem>>('/api/requests/mine', toParams(query));
  }

  pending(query: RequestQuery): Observable<PagedResult<RequestListItem>> {
    return this.api.get<PagedResult<RequestListItem>>('/api/requests/pending', toParams(query));
  }

  get(id: string): Observable<AllocationRequestDto> {
    return this.api.get<AllocationRequestDto>(`/api/requests/${id}`);
  }

  approve(id: string): Observable<AllocationRequestDto> {
    return this.api.post<AllocationRequestDto>(`/api/requests/${id}/approve`);
  }

  reject(id: string, body: RejectRequestDto): Observable<AllocationRequestDto> {
    return this.api.post<AllocationRequestDto>(`/api/requests/${id}/reject`, body);
  }

  handover(id: string): Observable<HandoverResult> {
    return this.api.get<HandoverResult>(`/api/requests/${id}/handover`);
  }
}

function toParams(query: RequestQuery): QueryParams {
  return { page: query.page, pageSize: query.pageSize };
}
