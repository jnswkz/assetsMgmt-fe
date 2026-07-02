import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { FilterSelect } from '../filter-select/filter-select';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { RequestsService } from '../services/requests.service';
import { AssetsService } from '../services/assets.service';
import { controlValue, matchesSearch } from '../utils/search';
import {
  AllocationRequestDto,
  AssetInstanceListItem,
  AssetModelListItem,
  RequestListItem,
} from '../models/api.model';
import {
  ASSET_CATEGORY,
  assetCategoryLabel,
  assetStatusValue,
  requestStatusLabel,
} from '../models/enums';

interface AssetRequest {
  readonly id: string;
  readonly assetInstanceId: string;
  readonly assetCode: string;
  readonly model: string;
  readonly status: string;
  readonly duration: string;
  readonly submitted: string;
}

interface AssetRequestDetail extends AssetRequest {
  readonly expectedDuration: string;
  readonly submitted: string;
  readonly reason: string;
  readonly approver: string;
  readonly decisionReason: string;
  readonly lockExpires: string;
}

interface RequestableAsset {
  readonly id: string;
  readonly modelId: string;
  readonly assetCode: string;
  readonly model: string;
  readonly label: string;
}

interface RequestableModel {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly manufacturer: string;
  readonly modelNumber: string;
  readonly instanceCount: number;
}

@Component({
  selector: 'app-my-requests-page',
  imports: [A11yModule, FilterSelect, MatIconModule, UserMenu],
  templateUrl: './my-requests-page.html',
  styleUrl: './my-requests-page.css',
})
export class MyRequestsPage {
  private readonly auth = inject(AuthService);
  private readonly requestsApi = inject(RequestsService);
  private readonly assetsApi = inject(AssetsService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  private readonly requests = signal<readonly AssetRequest[]>([]);
  private readonly assetModels = signal<readonly AssetModelListItem[]>([]);
  protected readonly requestableAssets = signal<readonly RequestableAsset[]>([]);
  protected readonly isLoadingRequestableAssets = signal(false);
  protected readonly globalSearch = signal('');
  protected readonly selectedRequest = signal<AssetRequestDetail | null>(null);
  protected readonly isCreateDialogOpen = signal(false);
  protected readonly modelSearch = signal('');
  protected readonly modelCategoryFilter = signal('');
  protected readonly isModelMenuOpen = signal(false);
  protected readonly selectedModelId = signal('');
  protected readonly selectedAssetId = signal('');
  protected readonly requestReason = signal('');
  protected readonly formError = signal('');
  protected readonly statusMessage = signal('');
  protected readonly toastMessage = signal('');
  protected readonly isLoading = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly modelCategories = ASSET_CATEGORY;
  private readonly loadedAssetModelId = signal('');
  protected readonly requestableModels = computed<readonly RequestableModel[]>(() =>
    this.assetModels().map(model => toRequestableModel(model))
  );
  protected readonly filteredRequestableModels = computed(() =>
    this.requestableModels().filter(model => {
      const matchesCategory =
        this.modelCategoryFilter() === '' || model.category === this.modelCategoryFilter();
      const matchesQuery = matchesSearch(this.modelSearch(), [
        model.name,
        model.category,
        model.manufacturer,
        model.modelNumber,
        model.instanceCount,
      ]);
      return matchesCategory && matchesQuery;
    })
  );
  protected readonly filteredRequestableAssets = computed(() =>
    this.requestableAssets()
  );
  protected readonly selectedRequestableModel = computed(
    () => this.requestableModels().find(model => model.id === this.selectedModelId()) ?? null
  );
  protected readonly filteredRequests = computed(() =>
    this.requests().filter(request =>
      matchesSearch(this.globalSearch(), [
        request.assetCode,
        request.model,
        request.status,
        request.duration,
      ])
    )
  );

  constructor() {
    this.load();
  }

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected openRequestDetail(request: AssetRequest): void {
    this.requestsApi.get(request.id).subscribe({
      next: detail => this.selectedRequest.set(toRequestDetail(detail)),
      error: () => this.errorMessage.set('Unable to load request details.'),
    });
  }

  protected closeRequestDetail(): void {
    this.selectedRequest.set(null);
  }

  protected openCreateDialog(): void {
    this.formError.set('');
    this.modelSearch.set('');
    this.modelCategoryFilter.set('');
    this.isModelMenuOpen.set(false);
    this.selectedModelId.set('');
    this.selectedAssetId.set('');
    this.requestReason.set('');
    this.toastMessage.set('');
    this.isCreateDialogOpen.set(true);
    this.loadRequestCatalog();
  }

  protected closeCreateDialog(): void {
    this.isCreateDialogOpen.set(false);
    this.isModelMenuOpen.set(false);
    this.loadedAssetModelId.set('');
    this.formError.set('');
    this.isSubmitting.set(false);
    this.toastMessage.set('');
  }

  protected updateModelSearch(event: Event): void {
    this.modelSearch.set(controlValue(event));
    this.syncSelectedModelAndAsset();
  }

  protected setModelCategoryFilter(value: string): void {
    this.modelCategoryFilter.set(value);
    this.syncSelectedModelAndAsset();
  }

  protected toggleModelMenu(): void {
    this.isModelMenuOpen.update(isOpen => !isOpen);
  }

  protected closeModelMenu(): void {
    this.isModelMenuOpen.set(false);
  }

  protected selectModel(modelId: string): void {
    this.selectedModelId.set(modelId);
    this.isModelMenuOpen.set(false);
    this.syncSelectedModelAndAsset();
  }

  protected selectAsset(assetId: string): void {
    this.selectedAssetId.set(assetId);
  }

  protected updateRequestReason(event: Event): void {
    this.requestReason.set(controlValue(event));
  }

  protected submitRequest(): void {
    const assetInstanceId = this.selectedAssetId();
    const reason = this.requestReason().trim();

    if (!assetInstanceId) {
      this.formError.set('Choose an asset to request.');
      return;
    }

    this.formError.set('');
    this.isSubmitting.set(true);
    this.requestsApi
      .create({
        assetInstanceId,
        reason: reason || null,
        idempotencyKey: buildIdempotencyKey(),
      })
      .subscribe({
        next: created => {
          this.requests.update(requests => [toRequestRow(created), ...requests]);
          this.statusMessage.set(`Request submitted for ${created.assetCode ?? 'the selected asset'}`);
          this.isSubmitting.set(false);
          this.closeCreateDialog();
          this.openRequestDetail(toRequestRow(created));
        },
        error: () => {
          this.formError.set('Unable to submit your request.');
          this.isSubmitting.set(false);
        },
      });
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.requestsApi.mine({ page: 1, pageSize: 100 }).subscribe({
      next: result => {
        this.requests.set(result.items.map(toRequestRow));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load your requests.');
        this.isLoading.set(false);
      },
    });
  }

  private loadRequestCatalog(): void {
    this.assetsApi.models().subscribe({
      next: result => {
        this.assetModels.set(result.items);
        this.syncSelectedModelAndAsset(true);
      },
      error: () => {
        this.formError.set('Unable to load asset models.');
      },
    });
  }

  private syncSelectedModelAndAsset(forceReloadAssets = false): void {
    const filteredModels = this.filteredRequestableModels();
    if (!filteredModels.some(model => model.id === this.selectedModelId())) {
      this.selectedModelId.set(filteredModels[0]?.id ?? '');
    }

    const selectedModelId = this.selectedModelId();
    if (!selectedModelId) {
      this.requestableAssets.set([]);
      this.loadedAssetModelId.set('');
      this.selectedAssetId.set('');
      this.toastMessage.set('');
      return;
    }

    if (forceReloadAssets || this.loadedAssetModelId() !== selectedModelId) {
      this.loadAssetsForSelectedModel(selectedModelId);
      return;
    }

    if (!this.filteredRequestableAssets().some(asset => asset.id === this.selectedAssetId())) {
      this.selectedAssetId.set(this.filteredRequestableAssets()[0]?.id ?? '');
    }
  }

  private loadAssetsForSelectedModel(modelId: string): void {
    const selectedModel =
      this.requestableModels().find(model => model.id === modelId) ?? null;

    this.isLoadingRequestableAssets.set(true);
    this.toastMessage.set('');
    this.selectedAssetId.set('');

    this.assetsApi
      .list({
        status: assetStatusValue('In stock'),
        modelId,
        page: 1,
        pageSize: 500,
      })
      .subscribe({
        next: result => {
          this.requestableAssets.set(result.items.map(toRequestableAsset));
          this.loadedAssetModelId.set(modelId);
          this.selectedAssetId.set(result.items[0]?.id ?? '');
          this.isLoadingRequestableAssets.set(false);

          if (result.items.length === 0 && selectedModel) {
            this.toastMessage.set(`No instances of ${selectedModel.name} are currently in stock.`);
          }
        },
        error: () => {
          this.requestableAssets.set([]);
          this.loadedAssetModelId.set('');
          this.selectedAssetId.set('');
          this.isLoadingRequestableAssets.set(false);
          this.formError.set('Unable to load available assets.');
        },
      });
  }
}

function toRequestRow(item: Pick<RequestListItem, 'id' | 'assetInstanceId' | 'assetCode' | 'modelName' | 'status' | 'expectedDurationMonths' | 'createdAt'>): AssetRequest {
  return {
    id: item.id,
    assetInstanceId: item.assetInstanceId,
    assetCode: item.assetCode ?? '-',
    model: item.modelName ?? '-',
    status: requestStatusLabel(item.status),
    duration: item.expectedDurationMonths ? `${item.expectedDurationMonths} mo` : '-',
    submitted: item.createdAt.slice(0, 10),
  };
}

function toRequestDetail(item: AllocationRequestDto): AssetRequestDetail {
  const durationMonths = item.expectedDurationMonths ?? 0;
  return {
    id: item.id,
    assetInstanceId: item.assetInstanceId,
    assetCode: item.assetCode ?? '-',
    model: item.modelName ?? '-',
    status: requestStatusLabel(item.status),
    duration: durationMonths ? `${durationMonths} mo` : '-',
    submitted: item.createdAt.slice(0, 10),
    expectedDuration: durationMonths ? `${durationMonths} months` : '-',
    reason: item.reason ?? '-',
    approver: item.approverName ?? '-',
    decisionReason: item.rejectedReason ?? '-',
    lockExpires: item.lockExpiresAt?.slice(0, 10) ?? '-',
  };
}

function toRequestableAsset(item: AssetInstanceListItem): RequestableAsset {
  const assetCode = item.assetCode ?? '-';
  const model = item.modelName ?? '-';
  const serial = item.serial ?? '-';
  const location = item.location ?? 'Unassigned location';
  return {
    id: item.id,
    modelId: item.modelId,
    assetCode,
    model,
    label: `${assetCode} - ${serial} - ${location}`,
  };
}

function toRequestableModel(item: AssetModelListItem): RequestableModel {
  return {
    id: item.id,
    name: item.name ?? '-',
    category: assetCategoryLabel(item.category),
    manufacturer: item.manufacturer ?? '-',
    modelNumber: item.modelNumber ?? '-',
    instanceCount: item.instanceCount,
  };
}

function buildIdempotencyKey(): string | null {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return null;
}
