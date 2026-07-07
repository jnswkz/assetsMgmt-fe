import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { Subject, debounceTime } from 'rxjs';
import { FilterSelect } from '../filter-select/filter-select';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { AssetsService } from '../services/assets.service';
import { LoadingSkeleton } from '../loading-skeleton/loading-skeleton';
import { controlValue, matchesSearch } from '../utils/search';
import { AssetModelListItem, CreateAssetModelRequest, PagedResult } from '../models/api.model';
import {
  ASSET_CATEGORY,
  DEPRECIATION_METHOD,
  assetCategoryLabel,
  assetCategoryValue,
} from '../models/enums';

interface ModelRow {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly manufacturer: string;
  readonly modelNumber: string;
  readonly usefulLife: string;
  readonly instances: number;
}

interface ModelForm {
  name: string;
  category: number;
  manufacturer: string;
  modelNumber: string;
  specs: string;
  defaultUsefulLifeMonths: string;
  defaultDepreciationMethod: number;
}

interface SpecEntry {
  readonly key: string;
  readonly value: string;
}

const EMPTY_FORM: ModelForm = {
  name: '',
  category: 0,
  manufacturer: '',
  modelNumber: '',
  specs: '',
  defaultUsefulLifeMonths: '',
  defaultDepreciationMethod: 0,
};

@Component({
  selector: 'app-asset-catalog-page',
  imports: [FilterSelect, LoadingSkeleton, MatIconModule, UserMenu],
  templateUrl: './asset-catalog-page.html',
  styleUrl: './asset-catalog-page.css',
})
export class AssetCatalogPage {
  private readonly auth = inject(AuthService);
  private readonly assetsApi = inject(AssetsService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  protected readonly canManageCatalog = computed(() => this.auth.role() === 'AdminIT');

  private readonly pageSize = 20;
  protected readonly page = signal(1);
  private readonly result = signal<PagedResult<AssetModelListItem> | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly statusMessage = signal('');

  protected readonly globalSearch = signal('');
  protected readonly modelSearch = signal('');
  protected readonly categoryFilter = signal('');
  private readonly searchInput = new Subject<string>();

  protected readonly categories = ASSET_CATEGORY;
  protected readonly depreciationMethods = DEPRECIATION_METHOD;

  // Create/edit dialog state (AdminIT only)
  protected readonly isDialogOpen = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly form = signal<ModelForm>({ ...EMPTY_FORM });
  protected readonly specEntries = signal<readonly SpecEntry[]>([{ key: '', value: '' }]);
  protected readonly formError = signal('');
  protected readonly isSaving = signal(false);

  // Delete confirmation state
  protected readonly deletingId = signal<string | null>(null);

  protected readonly rows = computed<readonly ModelRow[]>(() =>
    (this.result()?.items ?? []).map(toRow)
  );
  protected readonly filteredModels = computed(() =>
    this.rows().filter(model =>
      matchesSearch(this.globalSearch(), [
        model.name,
        model.category,
        model.manufacturer,
        model.modelNumber,
        model.usefulLife,
        model.instances,
      ])
    )
  );
  protected readonly total = computed(() => this.result()?.total ?? 0);
  protected readonly totalPages = computed(() => this.result()?.totalPages ?? 0);

  protected readonly dialogTitle = computed(() =>
    this.editingId() ? 'Edit asset model' : 'New asset model'
  );

  constructor() {
    this.searchInput.pipe(debounceTime(300), takeUntilDestroyed()).subscribe(value => {
      this.modelSearch.set(value);
      this.page.set(1);
      this.load();
    });
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const categoryLabel = this.categoryFilter();
    this.assetsApi
      .modelsPaged({
        category: categoryLabel ? assetCategoryValue(categoryLabel) : undefined,
        search: this.modelSearch() || undefined,
        page: this.page(),
        pageSize: this.pageSize,
      })
      .subscribe({
        next: result => {
          this.result.set(result);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Unable to load asset models.');
          this.isLoading.set(false);
        },
      });
  }

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected updateModelSearch(event: Event): void {
    this.searchInput.next(controlValue(event));
  }

  protected setCategoryFilter(value: string): void {
    this.categoryFilter.set(value);
    this.page.set(1);
    this.load();
  }

  protected prevPage(): void {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
      this.load();
    }
  }

  protected nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update(p => p + 1);
      this.load();
    }
  }

  // --- Create / edit (AdminIT) ---

  protected openCreate(): void {
    if (!this.canManageCatalog()) {
      return;
    }
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.specEntries.set([{ key: '', value: '' }]);
    this.formError.set('');
    this.isDialogOpen.set(true);
  }

  protected openEdit(row: ModelRow): void {
    if (!this.canManageCatalog()) {
      return;
    }
    this.formError.set('');
    this.editingId.set(row.id);
    this.assetsApi.model(row.id).subscribe({
      next: model => {
        this.form.set({
          name: model.name ?? '',
          category: model.category,
          manufacturer: model.manufacturer ?? '',
          modelNumber: model.modelNumber ?? '',
          specs: model.specs ?? '',
          defaultUsefulLifeMonths: model.defaultUsefulLifeMonths
            ? String(model.defaultUsefulLifeMonths)
            : '',
          defaultDepreciationMethod: model.defaultDepreciationMethod,
        });
        this.specEntries.set(parseSpecs(model.specsJson ?? model.specs));
        this.isDialogOpen.set(true);
      },
      error: () => this.errorMessage.set('Unable to load the model for editing.'),
    });
  }

  protected closeDialog(): void {
    this.isDialogOpen.set(false);
    this.editingId.set(null);
  }

  protected updateFormField(field: keyof ModelForm, event: Event): void {
    const value = controlValue(event);
    this.form.update(current => ({ ...current, [field]: value }));
  }

  protected updateFormNumber(field: 'category' | 'defaultDepreciationMethod', event: Event): void {
    const value = Number(controlValue(event));
    this.form.update(current => ({ ...current, [field]: Number.isNaN(value) ? 0 : value }));
  }

  protected updateSpec(index: number, field: keyof SpecEntry, event: Event): void {
    const value = controlValue(event);
    this.specEntries.update(entries => entries.map((entry, i) => i === index ? { ...entry, [field]: value } : entry));
  }

  protected addSpec(): void {
    this.specEntries.update(entries => [...entries, { key: '', value: '' }]);
  }

  protected removeSpec(index: number): void {
    this.specEntries.update(entries => entries.length === 1
      ? [{ key: '', value: '' }]
      : entries.filter((_, i) => i !== index));
  }

  protected saveModel(): void {
    const form = this.form();
    const name = form.name.trim();
    if (!name) {
      this.formError.set('Model name is required.');
      return;
    }

    const specs = specsJson(this.specEntries());
    if (specs === undefined) {
      this.formError.set('Specification keys must be unique and non-empty.');
      return;
    }

    const body: CreateAssetModelRequest = {
      name,
      category: form.category,
      manufacturer: form.manufacturer.trim() || null,
      modelNumber: form.modelNumber.trim() || null,
      specs,
      defaultUsefulLifeMonths: numberOrNull(form.defaultUsefulLifeMonths),
      defaultDepreciationMethod: form.defaultDepreciationMethod,
      imageUrl: null,
    };

    this.isSaving.set(true);
    this.formError.set('');
    const editingId = this.editingId();
    const request$ = editingId
      ? this.assetsApi.updateModel(editingId, body)
      : this.assetsApi.createModel(body);

    request$.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.statusMessage.set(editingId ? 'Model updated' : 'Model created');
        this.closeDialog();
        this.load();
      },
      error: () => {
        this.isSaving.set(false);
        this.formError.set('Save failed. Check the fields and try again.');
      },
    });
  }

  // --- Delete (AdminIT) ---

  protected askDelete(row: ModelRow): void {
    if (!this.canManageCatalog()) {
      return;
    }
    this.deletingId.set(row.id);
  }

  protected cancelDelete(): void {
    this.deletingId.set(null);
  }

  protected confirmDelete(): void {
    const id = this.deletingId();
    if (!id) {
      return;
    }
    this.assetsApi.deleteModel(id).subscribe({
      next: () => {
        this.statusMessage.set('Model deleted');
        this.deletingId.set(null);
        this.load();
      },
      error: () => {
        this.errorMessage.set('Delete failed. The model may have existing instances.');
        this.deletingId.set(null);
      },
    });
  }
}

function toRow(item: AssetModelListItem): ModelRow {
  return {
    id: item.id,
    name: item.name ?? '-',
    category: assetCategoryLabel(item.category),
    manufacturer: item.manufacturer ?? '-',
    modelNumber: item.modelNumber ?? '-',
    usefulLife: item.defaultUsefulLifeMonths ? `${item.defaultUsefulLifeMonths} mo` : '-',
    instances: item.instanceCount,
  };
}

function numberOrNull(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseSpecs(value: string | null): SpecEntry[] {
  if (!value) return [{ key: '', value: '' }];
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const entries = Object.entries(parsed).map(([key, item]) => ({ key, value: String(item ?? '') }));
    return entries.length > 0 ? entries : [{ key: '', value: '' }];
  } catch {
    return [{ key: 'details', value }];
  }
}

function specsJson(entries: readonly SpecEntry[]): string | null | undefined {
  const populated = entries.filter(entry => entry.key.trim() || entry.value.trim());
  if (populated.length === 0) return null;
  const keys = populated.map(entry => entry.key.trim());
  if (keys.some(key => !key) || new Set(keys).size !== keys.length) return undefined;
  return JSON.stringify(Object.fromEntries(populated.map(entry => [entry.key.trim(), entry.value.trim()])));
}
