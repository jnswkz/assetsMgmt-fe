import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, QueryParams } from './api.service';
import {
  CreateUserRequest,
  PagedResult,
  ResetPasswordRequest,
  UpdateUserRequest,
  UserDto,
  UserListItem,
} from '../models/api.model';

export interface UserQuery {
  readonly role?: number;
  readonly departmentId?: string;
  readonly isActive?: boolean;
  readonly search?: string;
  readonly page: number;
  readonly pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = inject(ApiService);

  list(query: UserQuery): Observable<PagedResult<UserListItem>> {
    const params: QueryParams = {
      role: query.role,
      departmentId: query.departmentId,
      isActive: query.isActive,
      search: query.search,
      page: query.page,
      pageSize: query.pageSize,
    };
    return this.api.get<PagedResult<UserListItem>>('/api/users', params);
  }

  get(id: string): Observable<UserDto> {
    return this.api.get<UserDto>(`/api/users/${id}`);
  }

  create(body: CreateUserRequest): Observable<UserDto> {
    return this.api.post<UserDto>('/api/users', body);
  }

  update(id: string, body: UpdateUserRequest): Observable<UserDto> {
    return this.api.put<UserDto>(`/api/users/${id}`, body);
  }

  offboard(id: string): Observable<UserDto> {
    return this.api.post<UserDto>(`/api/users/${id}/offboard`, {});
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/api/users/${id}`);
  }

  resetPassword(id: string, body: ResetPasswordRequest): Observable<void> {
    return this.api.post<void>(`/api/users/${id}/reset-password`, body);
  }
}
