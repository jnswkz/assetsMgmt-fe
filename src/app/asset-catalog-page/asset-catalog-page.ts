import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FilterSelect } from '../filter-select/filter-select';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { controlValue, matchesSearch, uniqueStrings } from '../utils/search';

interface AssetModel {
  readonly name: string;
  readonly category: string;
  readonly manufacturer: string;
  readonly modelNumber: string;
  readonly usefulLife: string;
  readonly instances: number;
}

const ASSET_MODELS: readonly AssetModel[] = [
  {
    name: 'MacBook Pro 14"',
    category: 'Laptop',
    manufacturer: 'Apple',
    modelNumber: 'MBP14-M3',
    usefulLife: '48 mo',
    instances: 6,
  },
  {
    name: 'ThinkPad X1 Carbon',
    category: 'Laptop',
    manufacturer: 'Lenovo',
    modelNumber: 'X1C-G11',
    usefulLife: '36 mo',
    instances: 4,
  },
  {
    name: 'Dell UltraSharp 27',
    category: 'Monitor',
    manufacturer: 'Dell',
    modelNumber: 'U2723QE',
    usefulLife: '60 mo',
    instances: 5,
  },
  {
    name: 'iPhone 15 Pro',
    category: 'Phone',
    manufacturer: 'Apple',
    modelNumber: 'A2848',
    usefulLife: '36 mo',
    instances: 3,
  },
  {
    name: 'iPad Air',
    category: 'Tablet',
    manufacturer: 'Apple',
    modelNumber: 'iPad-Air-M2',
    usefulLife: '36 mo',
    instances: 2,
  },
  {
    name: 'Logitech MX Master 3S',
    category: 'Peripheral',
    manufacturer: 'Logitech',
    modelNumber: 'MX3S',
    usefulLife: '24 mo',
    instances: 8,
  },
  {
    name: 'HP LaserJet Pro',
    category: 'Printer',
    manufacturer: 'HP',
    modelNumber: 'M404dn',
    usefulLife: '60 mo',
    instances: 2,
  },
  {
    name: 'Cisco Catalyst 9200',
    category: 'NetworkDevice',
    manufacturer: 'Cisco',
    modelNumber: 'C9200-24P',
    usefulLife: '84 mo',
    instances: 2,
  },
];

@Component({
  selector: 'app-asset-catalog-page',
  imports: [FilterSelect, MatIconModule],
  templateUrl: './asset-catalog-page.html',
  styleUrl: './asset-catalog-page.css',
})
export class AssetCatalogPage {
  private readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.currentUser;
  protected readonly models = ASSET_MODELS;
  protected readonly globalSearch = signal('');
  protected readonly modelSearch = signal('');
  protected readonly categoryFilter = signal('');
  protected readonly categories = uniqueStrings(ASSET_MODELS.map(model => model.category));
  protected readonly canManageCatalog = computed(() => this.auth.role() !== 'Employee');
  protected readonly primaryActionLabel = computed(() =>
    this.canManageCatalog() ? 'New model' : 'Request model'
  );
  protected readonly filteredModels = computed(() => {
    const category = this.categoryFilter();

    return this.models.filter(model =>
      (!category || model.category === category) &&
      matchesSearch(this.globalSearch(), [
        model.name,
        model.category,
        model.manufacturer,
        model.modelNumber,
        model.usefulLife,
        model.instances,
      ]) &&
      matchesSearch(this.modelSearch(), [
        model.name,
        model.category,
        model.manufacturer,
        model.modelNumber,
      ])
    );
  });

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected updateModelSearch(event: Event): void {
    this.modelSearch.set(controlValue(event));
  }

  protected updateCategoryFilter(event: Event): void {
    this.categoryFilter.set(controlValue(event));
  }
}
