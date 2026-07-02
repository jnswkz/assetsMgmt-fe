import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FilterSelect } from '../filter-select/filter-select';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { controlValue, matchesSearch, uniqueStrings } from '../utils/search';

type AssetStatus = 'Allocated' | 'In stock' | 'Maintenance' | 'Locked' | 'Retired' | 'Lost' | 'Disposed';

interface AssetUnit {
  readonly code: string;
  readonly serial: string;
  readonly model: string;
  readonly status: AssetStatus;
  readonly currentHolder: string;
  readonly location: string;
}

interface AssetDetail {
  readonly asset: AssetUnit;
  readonly manufacturer: string;
  readonly acquisitionCost: string;
  readonly acquisitionDate: string;
  readonly salvageValue: string;
  readonly warrantyExpiry: string;
  readonly notes: string;
  readonly specs: string;
  readonly usefulLife: string;
  readonly maintenanceRecords: number;
  readonly allocationEvents: number;
}

interface ModelProfile {
  readonly manufacturer: string;
  readonly acquisitionCost: string;
  readonly salvageValue: string;
  readonly specs: string;
  readonly usefulLife: string;
  readonly notes: string;
}

const MODEL_PROFILES: Record<string, ModelProfile> = {
  'MacBook Pro 14"': {
    manufacturer: 'Apple',
    acquisitionCost: '$2,399',
    salvageValue: '$300',
    specs: 'Apple M3 Pro, 18GB RAM, 512GB SSD',
    usefulLife: '48 months',
    notes: 'Standard issue dev laptop.',
  },
  'ThinkPad X1 Carbon': {
    manufacturer: 'Lenovo',
    acquisitionCost: '$1,699',
    salvageValue: '$220',
    specs: 'Intel Core Ultra 7, 16GB RAM, 1TB SSD',
    usefulLife: '36 months',
    notes: 'Portable laptop for hybrid work.',
  },
  'Dell UltraSharp 27': {
    manufacturer: 'Dell',
    acquisitionCost: '$589',
    salvageValue: '$80',
    specs: '27 inch 4K USB-C monitor',
    usefulLife: '60 months',
    notes: 'Desk display for office workstations.',
  },
  'iPhone 15 Pro': {
    manufacturer: 'Apple',
    acquisitionCost: '$999',
    salvageValue: '$180',
    specs: '256GB, 5G, managed mobile device',
    usefulLife: '36 months',
    notes: 'Mobile device assigned through MDM.',
  },
  'iPad Air': {
    manufacturer: 'Apple',
    acquisitionCost: '$699',
    salvageValue: '$120',
    specs: 'M2, 11 inch, Wi-Fi + Cellular',
    usefulLife: '36 months',
    notes: 'Tablet for field and review workflows.',
  },
  'Logitech MX Master 3S': {
    manufacturer: 'Logitech',
    acquisitionCost: '$99',
    salvageValue: '$10',
    specs: 'Wireless ergonomic mouse',
    usefulLife: '24 months',
    notes: 'Peripheral issued with workstation kits.',
  },
  'HP LaserJet Pro': {
    manufacturer: 'HP',
    acquisitionCost: '$349',
    salvageValue: '$40',
    specs: 'Monochrome network laser printer',
    usefulLife: '60 months',
    notes: 'Shared printer for office floors.',
  },
  'Cisco Catalyst 9200': {
    manufacturer: 'Cisco',
    acquisitionCost: '$4,200',
    salvageValue: '$500',
    specs: '24-port managed access switch',
    usefulLife: '84 months',
    notes: 'Network infrastructure asset.',
  },
};

const ASSET_UNITS: readonly AssetUnit[] = [
  {
    code: 'AH-0001',
    serial: 'C02XW0AAJG5J',
    model: 'MacBook Pro 14"',
    status: 'Allocated',
    currentHolder: 'Chloe Davis',
    location: 'HQ / 4F / Desk 412',
  },
  {
    code: 'AH-0002',
    serial: 'C02XW0BBJG5K',
    model: 'MacBook Pro 14"',
    status: 'In stock',
    currentHolder: '-',
    location: 'HQ / IT Storage',
  },
  {
    code: 'AH-0003',
    serial: 'C02XW0CCJG5L',
    model: 'MacBook Pro 14"',
    status: 'Maintenance',
    currentHolder: '-',
    location: 'Repair Center',
  },
  {
    code: 'AH-0004',
    serial: 'C02XW0DDJG5M',
    model: 'MacBook Pro 14"',
    status: 'Allocated',
    currentHolder: 'Diego Ramirez',
    location: 'HQ / 3F / Desk 318',
  },
  {
    code: 'AH-0005',
    serial: 'LX1C2304871',
    model: 'ThinkPad X1 Carbon',
    status: 'Allocated',
    currentHolder: 'Felix Wong',
    location: 'HQ / 2F / Desk 207',
  },
  {
    code: 'AH-0006',
    serial: 'LX1C2304872',
    model: 'ThinkPad X1 Carbon',
    status: 'In stock',
    currentHolder: '-',
    location: 'HQ / IT Storage',
  },
  {
    code: 'AH-0007',
    serial: 'LX1C2304873',
    model: 'ThinkPad X1 Carbon',
    status: 'Locked',
    currentHolder: '-',
    location: 'HQ / IT Storage',
  },
  {
    code: 'AH-0008',
    serial: 'CN-DELL-1011',
    model: 'Dell UltraSharp 27',
    status: 'Allocated',
    currentHolder: 'Chloe Davis',
    location: 'HQ / 4F / Desk 412',
  },
  {
    code: 'AH-0009',
    serial: 'CN-DELL-1012',
    model: 'Dell UltraSharp 27',
    status: 'Allocated',
    currentHolder: 'Diego Ramirez',
    location: 'HQ / 3F / Desk 318',
  },
  {
    code: 'AH-0010',
    serial: 'CN-DELL-1013',
    model: 'Dell UltraSharp 27',
    status: 'In stock',
    currentHolder: '-',
    location: 'HQ / IT Storage',
  },
  {
    code: 'AH-0011',
    serial: 'F2LX-9981',
    model: 'iPhone 15 Pro',
    status: 'Allocated',
    currentHolder: 'Felix Wong',
    location: 'Mobile / Sales',
  },
  {
    code: 'AH-0012',
    serial: 'F2LX-9982',
    model: 'iPhone 15 Pro',
    status: 'Retired',
    currentHolder: '-',
    location: 'Archive',
  },
  {
    code: 'AH-0013',
    serial: 'F2LX-9983',
    model: 'iPhone 15 Pro',
    status: 'Lost',
    currentHolder: '-',
    location: '-',
  },
  {
    code: 'AH-0014',
    serial: 'DMX-AIR-101',
    model: 'iPad Air',
    status: 'Allocated',
    currentHolder: 'Gina Patel',
    location: 'Marketing',
  },
  {
    code: 'AH-0015',
    serial: 'DMX-AIR-102',
    model: 'iPad Air',
    status: 'In stock',
    currentHolder: '-',
    location: 'HQ / IT Storage',
  },
  {
    code: 'AH-0016',
    serial: 'LGT-MX3S-A1',
    model: 'Logitech MX Master 3S',
    status: 'Allocated',
    currentHolder: 'Chloe Davis',
    location: 'HQ / 4F',
  },
  {
    code: 'AH-0017',
    serial: 'LGT-MX3S-A2',
    model: 'Logitech MX Master 3S',
    status: 'In stock',
    currentHolder: '-',
    location: 'HQ / IT Storage',
  },
  {
    code: 'AH-0018',
    serial: 'HP-LJP-3301',
    model: 'HP LaserJet Pro',
    status: 'Allocated',
    currentHolder: '-',
    location: 'HQ / 2F / Print',
  },
  {
    code: 'AH-0019',
    serial: 'CSC-9200-77',
    model: 'Cisco Catalyst 9200',
    status: 'Allocated',
    currentHolder: '-',
    location: 'MDF Room',
  },
  {
    code: 'AH-0020',
    serial: 'C02XW0EEJG5N',
    model: 'MacBook Pro 14"',
    status: 'Disposed',
    currentHolder: '-',
    location: 'Disposed',
  },
];

@Component({
  selector: 'app-assets-page',
  imports: [FilterSelect, MatIconModule],
  templateUrl: './assets-page.html',
  styleUrl: './assets-page.css',
})
export class AssetsPage {
  private readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.currentUser;
  protected readonly assets = ASSET_UNITS;
  protected readonly globalSearch = signal('');
  protected readonly assetSearch = signal('');
  protected readonly statusFilter = signal('');
  protected readonly modelFilter = signal('');
  protected readonly statuses = uniqueStrings(ASSET_UNITS.map(asset => asset.status));
  protected readonly models = uniqueStrings(ASSET_UNITS.map(asset => asset.model));
  protected readonly selectedAsset = signal<AssetUnit | null>(null);
  protected readonly canManageAssets = computed(() => this.auth.role() !== 'Employee');
  protected readonly filteredAssets = computed(() => {
    const status = this.statusFilter();
    const model = this.modelFilter();

    return this.assets.filter(asset =>
      (!status || asset.status === status) &&
      (!model || asset.model === model) &&
      matchesSearch(this.globalSearch(), [
        asset.code,
        asset.serial,
        asset.model,
        asset.status,
        asset.currentHolder,
        asset.location,
      ]) &&
      matchesSearch(this.assetSearch(), [
        asset.code,
        asset.serial,
        asset.model,
        asset.currentHolder,
        asset.location,
      ])
    );
  });
  protected readonly selectedAssetDetail = computed(() => {
    const asset = this.selectedAsset();

    return asset ? buildAssetDetail(asset) : null;
  });

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected updateAssetSearch(event: Event): void {
    this.assetSearch.set(controlValue(event));
  }

  protected updateStatusFilter(event: Event): void {
    this.statusFilter.set(controlValue(event));
  }

  protected updateModelFilter(event: Event): void {
    this.modelFilter.set(controlValue(event));
  }

  protected openAssetDetail(asset: AssetUnit): void {
    this.selectedAsset.set(asset);
  }

  protected closeAssetDetail(): void {
    this.selectedAsset.set(null);
  }
}

function buildAssetDetail(asset: AssetUnit): AssetDetail {
  const profile = MODEL_PROFILES[asset.model];
  const sequence = Number(asset.code.replace('AH-', ''));
  const acquisitionDay = String(((sequence + 4) % 24) + 1).padStart(2, '0');
  const maintenanceRecords = asset.status === 'Maintenance' ? 1 : 0;
  const allocationEvents = asset.currentHolder === '-' ? 0 : 1;

  return {
    asset,
    manufacturer: profile.manufacturer,
    acquisitionCost: profile.acquisitionCost,
    acquisitionDate: `2025-05-${acquisitionDay}`,
    salvageValue: profile.salvageValue,
    warrantyExpiry: `2027-05-${acquisitionDay}`,
    notes: profile.notes,
    specs: profile.specs,
    usefulLife: profile.usefulLife,
    maintenanceRecords,
    allocationEvents,
  };
}
