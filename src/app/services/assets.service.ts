import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, QueryParams } from './api.service';
import {
  AssetInstanceDto,
  AssetInstanceListItem,
  AssetModelDto,
  AssetModelListItem,
  AllocationHistoryItem,
  CompleteMaintenanceDto,
  CreateAssetInstanceRequest,
  CreateAssetModelRequest,
  DisposeAssetDto,
  MaintenanceRecordDto,
  PagedResult,
  ReturnAssetDto,
  StartMaintenanceDto,
  TransferAssetDto,
  UpdateAssetInstanceRequest,
  UpdateAssetModelRequest,
} from '../models/api.model';

export interface AssetQuery {
  readonly status?: number;
  readonly modelId?: string;
  readonly search?: string;
  readonly page: number;
  readonly pageSize: number;
}

export interface ModelQuery {
  readonly category?: number;
  readonly search?: string;
  readonly page: number;
  readonly pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class AssetsService {
  private readonly api = inject(ApiService);

  list(query: AssetQuery): Observable<PagedResult<AssetInstanceListItem>> {
    const params: QueryParams = {
      status: query.status,
      modelId: query.modelId,
      search: query.search,
      page: query.page,
      pageSize: query.pageSize,
    };
    return this.api.get<PagedResult<AssetInstanceListItem>>('/api/assets', params);
  }

  get(id: string): Observable<AssetInstanceDto> {
    return this.api.get<AssetInstanceDto>(`/api/assets/${id}`);
  }

  createAsset(body: CreateAssetInstanceRequest): Observable<AssetInstanceDto> {
    return this.api.post<AssetInstanceDto>('/api/assets', body);
  }

  updateAsset(id: string, body: UpdateAssetInstanceRequest): Observable<AssetInstanceDto> {
    return this.api.put<AssetInstanceDto>(`/api/assets/${id}`, body);
  }

  deleteAsset(id: string): Observable<void> {
    return this.api.delete<void>(`/api/assets/${id}`);
  }

  /** All models, unpaginated-ish (large page) — used to populate filter dropdowns. */
  models(search?: string): Observable<PagedResult<AssetModelListItem>> {
    return this.api.get<PagedResult<AssetModelListItem>>('/api/asset-models', {
      search,
      page: 1,
      pageSize: 200,
    });
  }

  /** Paginated model list with category + search filters — used by the catalog page. */
  modelsPaged(query: ModelQuery): Observable<PagedResult<AssetModelListItem>> {
    const params: QueryParams = {
      category: query.category,
      search: query.search,
      page: query.page,
      pageSize: query.pageSize,
    };
    return this.api.get<PagedResult<AssetModelListItem>>('/api/asset-models', params);
  }

  model(id: string): Observable<AssetModelDto> {
    return this.api.get<AssetModelDto>(`/api/asset-models/${id}`);
  }

  createModel(body: CreateAssetModelRequest): Observable<AssetModelDto> {
    return this.api.post<AssetModelDto>('/api/asset-models', body);
  }

  updateModel(id: string, body: UpdateAssetModelRequest): Observable<AssetModelDto> {
    return this.api.put<AssetModelDto>(`/api/asset-models/${id}`, body);
  }

  deleteModel(id: string): Observable<void> {
    return this.api.delete<void>(`/api/asset-models/${id}`);
  }

  history(assetId: string): Observable<PagedResult<AllocationHistoryItem>> {
    return this.api.get<PagedResult<AllocationHistoryItem>>(`/api/assets/${assetId}/history`, {
      page: 1,
      pageSize: 1,
    });
  }

  maintenance(assetId: string): Observable<PagedResult<MaintenanceRecordDto>> {
    return this.api.get<PagedResult<MaintenanceRecordDto>>(`/api/assets/${assetId}/maintenance`, {
      page: 1,
      pageSize: 1,
    });
  }

  returnAsset(id: string, body: ReturnAssetDto): Observable<void> {
    return this.api.post<void>(`/api/assets/${id}/return`, body);
  }

  transfer(id: string, body: TransferAssetDto): Observable<void> {
    return this.api.post<void>(`/api/assets/${id}/transfer`, body);
  }

  startMaintenance(id: string, body: StartMaintenanceDto): Observable<MaintenanceRecordDto> {
    return this.api.post<MaintenanceRecordDto>(`/api/assets/${id}/maintenance`, body);
  }

  completeMaintenance(
    id: string,
    recordId: string,
    body: CompleteMaintenanceDto
  ): Observable<MaintenanceRecordDto> {
    return this.api.post<MaintenanceRecordDto>(
      `/api/assets/${id}/maintenance/${recordId}/complete`,
      body
    );
  }

  dispose(id: string, body: DisposeAssetDto): Observable<unknown> {
    return this.api.post<unknown>(`/api/assets/${id}/dispose`, body);
  }
}
