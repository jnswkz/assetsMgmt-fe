import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, QueryParams } from './api.service';
import {
  AssignManagerRequest,
  CreateDepartmentRequest,
  DepartmentDto,
  DepartmentListItem,
  PagedResult,
  UpdateDepartmentRequest,
} from '../models/api.model';

export interface DepartmentQuery {
  readonly isActive?: boolean;
  readonly search?: string;
  readonly page: number;
  readonly pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class DepartmentsService {
  private readonly api = inject(ApiService);

  list(query: DepartmentQuery): Observable<PagedResult<DepartmentListItem>> {
    const params: QueryParams = {
      isActive: query.isActive,
      search: query.search,
      page: query.page,
      pageSize: query.pageSize,
    };
    return this.api.get<PagedResult<DepartmentListItem>>('/api/departments', params);
  }

  get(id: string): Observable<DepartmentDto> {
    return this.api.get<DepartmentDto>(`/api/departments/${id}`);
  }

  create(body: CreateDepartmentRequest): Observable<DepartmentDto> {
    return this.api.post<DepartmentDto>('/api/departments', body);
  }

  update(id: string, body: UpdateDepartmentRequest): Observable<DepartmentDto> {
    return this.api.put<DepartmentDto>(`/api/departments/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/api/departments/${id}`);
  }

  assignManager(id: string, body: AssignManagerRequest): Observable<DepartmentDto> {
    return this.api.post<DepartmentDto>(`/api/departments/${id}/manager`, body);
  }
}
