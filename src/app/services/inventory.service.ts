import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryScanDto } from '../models/api.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly api = inject(ApiService);

  create(departmentId?: string | null): Observable<InventoryScanDto> {
    return this.api.post<InventoryScanDto>('/api/inventory-scans', { departmentId: departmentId ?? null });
  }

  addItem(id: string, assetCode: string): Observable<InventoryScanDto> {
    return this.api.post<InventoryScanDto>(`/api/inventory-scans/${id}/items`, { assetCode });
  }

  close(id: string): Observable<InventoryScanDto> {
    return this.api.post<InventoryScanDto>(`/api/inventory-scans/${id}/close`);
  }
}
