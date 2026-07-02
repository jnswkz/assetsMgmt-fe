import { Role } from './nav-item';

// Backend enums are integers (zero-indexed). Index in each array = the backend int value.
// List endpoints return integers; detail/me endpoints return strings. These helpers bridge both.

export const ASSET_STATUS = [
  'In stock',
  'Locked',
  'Allocated',
  'Maintenance',
  'Retired',
  'Lost',
  'Disposed',
] as const;
export type AssetStatusLabel = (typeof ASSET_STATUS)[number];

export const ASSET_CATEGORY = [
  'Laptop',
  'Monitor',
  'Phone',
  'Tablet',
  'Peripheral',
  'Printer',
  'NetworkDevice',
  'Other',
] as const;
export type AssetCategoryLabel = (typeof ASSET_CATEGORY)[number];

export const REQUEST_STATUS = [
  'Pending',
  'Locked',
  'Approved',
  'Rejected',
  'Expired',
  'Cancelled',
] as const;
export type RequestStatusLabel = (typeof REQUEST_STATUS)[number];

export const USER_ROLE = ['Employee', 'Manager', 'AdminIT'] as const;

export const DISPOSAL_TYPE = ['Sold', 'Scrapped', 'Donated', 'Lost'] as const;
export type DisposalTypeLabel = (typeof DISPOSAL_TYPE)[number];

export const MAINTENANCE_TYPE = [
  'Repair',
  'Upgrade',
  'Inspection',
  'Warranty claim',
  'Cleaning',
] as const;

export const MAINTENANCE_STATUS = ['In progress', 'Completed', 'Cancelled'] as const;

export const DEPRECIATION_METHOD = ['Straight line', 'Declining balance'] as const;
export type DepreciationMethodLabel = (typeof DEPRECIATION_METHOD)[number];

function labelAt<T extends string>(values: readonly T[], index: number, fallback: T): T {
  return values[index] ?? fallback;
}

function indexOfLabel(values: readonly string[], label: string): number {
  const index = values.indexOf(label);
  return index === -1 ? 0 : index;
}

export function assetStatusLabel(value: number): AssetStatusLabel {
  return labelAt(ASSET_STATUS, value, 'In stock');
}

export function assetStatusValue(label: string): number {
  return indexOfLabel(ASSET_STATUS, label);
}

export function assetCategoryLabel(value: number): AssetCategoryLabel {
  return labelAt(ASSET_CATEGORY, value, 'Other');
}

export function assetCategoryValue(label: string): number {
  return indexOfLabel(ASSET_CATEGORY, label);
}

export function requestStatusLabel(value: number): RequestStatusLabel {
  return labelAt(REQUEST_STATUS, value, 'Pending');
}

export function userRoleLabel(value: number): Role {
  return labelAt(USER_ROLE, value, 'Employee') as Role;
}

export function userRoleValue(role: Role): number {
  return indexOfLabel(USER_ROLE, role);
}

export function disposalTypeLabel(value: number): DisposalTypeLabel {
  return labelAt(DISPOSAL_TYPE, value, 'Scrapped');
}

export function maintenanceStatusLabel(value: number): string {
  return labelAt(MAINTENANCE_STATUS, value, 'In progress');
}

export function depreciationMethodLabel(value: number): DepreciationMethodLabel {
  return labelAt(DEPRECIATION_METHOD, value, 'Straight line');
}
