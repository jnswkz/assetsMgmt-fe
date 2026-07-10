// DTOs matching the AssetMgmt backend (see api-docs/docs-api.md).
// Enum fields (status, category, role, disposalType, ...) arrive as integers on
// list endpoints — map them with helpers in ./enums.ts.

export interface PagedResult<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

// --- Assets ---
export interface AssetInstanceListItem {
  readonly id: string;
  readonly assetCode: string | null;
  readonly serial: string | null;
  readonly modelId: string;
  readonly modelName: string | null;
  readonly status: number;
  readonly currentHolderId: string | null;
  readonly currentHolderName: string | null;
  readonly location: string | null;
  readonly qrCodePath: string | null;
  readonly qrCodeUrl?: string | null;
}

export interface AssetInstanceDto extends AssetInstanceListItem {
  readonly acquisitionCost: number;
  readonly acquisitionDate: string;
  readonly salvageValue: number;
  readonly warrantyExpiresAt: string | null;
  readonly notes: string | null;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AvailableAssetItem {
  readonly id: string;
  readonly assetCode: string;
  readonly modelId: string;
  readonly modelName: string;
  readonly category: number;
  readonly specsSummary: string | null;
  readonly location: string | null;
}

export interface CreateAssetInstanceRequest {
  readonly modelId: string;
  readonly serial?: string | null;
  readonly acquisitionCost: number;
  readonly acquisitionDate: string;
  readonly salvageValue?: number | null;
  readonly location?: string | null;
  readonly warrantyExpiresAt?: string | null;
  readonly notes?: string | null;
}

export type UpdateAssetInstanceRequest = Omit<CreateAssetInstanceRequest, 'modelId'>;

export interface ReturnAssetDto {
  readonly notes?: string | null;
}

export interface TransferAssetDto {
  readonly toUserId: string;
  readonly notes?: string | null;
}

export interface StartMaintenanceDto {
  readonly type: number;
  readonly description: string;
  readonly vendor?: string | null;
  readonly cost?: number | null;
}

export interface CompleteMaintenanceDto {
  readonly cost?: number | null;
  readonly notes?: string | null;
}

export interface DisposeAssetDto {
  readonly type: number;
  readonly soldToUserId?: string | null;
  readonly salePrice?: number | null;
  readonly reason?: string | null;
}

export interface MaintenanceRecordDto {
  readonly id: string;
  readonly assetInstanceId: string;
  readonly assetCode: string | null;
  readonly maintenanceType: number;
  readonly description: string | null;
  readonly cost: number;
  readonly vendor: string | null;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly status: number;
  readonly notes: string | null;
  readonly createdAt: string;
}

export interface MyAssetItem {
  readonly assetInstanceId: string;
  readonly assetCode: string | null;
  readonly modelName: string | null;
  readonly status: number;
  readonly location: string | null;
  readonly startDate: string;
  readonly expectedReturnAt?: string | null;
  readonly allocationRequestId?: string | null;
  readonly handoverDocumentNumber?: string | null;
  readonly hasHandover: boolean;
}

// --- Asset models ---
export interface AssetModelListItem {
  readonly id: string;
  readonly name: string | null;
  readonly category: number;
  readonly manufacturer: string | null;
  readonly modelNumber: string | null;
  readonly defaultUsefulLifeMonths: number;
  readonly instanceCount: number;
}

export interface AssetModelDto {
  readonly id: string;
  readonly name: string | null;
  readonly category: number;
  readonly manufacturer: string | null;
  readonly modelNumber: string | null;
  readonly specs: string | null;
  readonly specsJson?: string | null;
  readonly defaultUsefulLifeMonths: number;
  readonly defaultDepreciationMethod: number;
  readonly imageUrl: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateAssetModelRequest {
  readonly name: string | null;
  readonly category: number;
  readonly manufacturer?: string | null;
  readonly modelNumber?: string | null;
  readonly specs?: string | null;
  readonly defaultUsefulLifeMonths?: number | null;
  readonly defaultDepreciationMethod: number;
  readonly imageUrl?: string | null;
}

export type UpdateAssetModelRequest = CreateAssetModelRequest;

// --- Allocation requests ---
export interface AllocationRequestDto {
  readonly id: string;
  readonly requesterId: string;
  readonly requesterName: string | null;
  readonly assetInstanceId: string;
  readonly assetCode: string | null;
  readonly modelName: string | null;
  readonly status: number;
  readonly reason: string | null;
  readonly expectedDurationMonths: number | null;
  readonly approverId: string | null;
  readonly approverName: string | null;
  readonly approvedAt: string | null;
  readonly rejectedReason: string | null;
  readonly lockExpiresAt: string | null;
  readonly handoverDueAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface RequestListItem {
  readonly id: string;
  readonly requesterId: string;
  readonly requesterName: string | null;
  readonly assetInstanceId: string;
  readonly assetCode: string | null;
  readonly modelName: string | null;
  readonly status: number;
  readonly expectedDurationMonths: number | null;
  readonly lockExpiresAt: string | null;
  readonly handoverDueAt?: string;
  readonly createdAt: string;
}

export interface CreateRequestDto {
  readonly assetInstanceId: string;
  readonly reason?: string | null;
  readonly expectedDurationMonths?: number | null;
  readonly idempotencyKey?: string | null;
}

export interface RejectRequestDto {
  readonly reason: string;
}

export interface HandoverResult {
  readonly id: string;
  readonly documentNumber: string | null;
  readonly downloadUrl: string;
}

// --- Allocation history ---
export interface AllocationHistoryItem {
  readonly id: string;
  readonly assetInstanceId: string;
  readonly assetCode: string | null;
  readonly modelName: string | null;
  readonly userId: string;
  readonly userName: string | null;
  readonly eventType: number;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly expectedReturnAt?: string | null;
  readonly allocationRequestId: string | null;
  readonly notes: string | null;
  readonly createdAt: string;
}

// --- Departments ---
export interface DepartmentListItem {
  readonly id: string;
  readonly code: string | null;
  readonly name: string | null;
  readonly managerId: string | null;
  readonly managerName: string | null;
  readonly isActive: boolean;
  readonly userCount: number;
}

export interface DepartmentDto {
  readonly id: string;
  readonly code: string | null;
  readonly name: string | null;
  readonly managerId: string | null;
  readonly managerName: string | null;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateDepartmentRequest {
  readonly code: string | null;
  readonly name: string | null;
  readonly managerId?: string | null;
}

export interface UpdateDepartmentRequest {
  readonly name: string | null;
  readonly managerId?: string | null;
  readonly isActive: boolean;
}

export interface AssignManagerRequest {
  readonly managerId: string;
}

// --- Users ---
export interface UserListItem {
  readonly id: string;
  readonly userName: string | null;
  readonly email: string | null;
  readonly fullName: string | null;
  readonly employeeCode: string | null;
  readonly role: number;
  readonly departmentId: string | null;
  readonly departmentName: string | null;
  readonly isActive: boolean;
}

export interface UserDto extends UserListItem {
  readonly lastLoginAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateUserRequest {
  readonly userName: string | null;
  readonly email: string | null;
  readonly password: string | null;
  readonly fullName: string | null;
  readonly employeeCode: string | null;
  readonly role: number;
  readonly departmentId?: string | null;
}

export interface UpdateUserRequest {
  readonly email: string | null;
  readonly fullName: string | null;
  readonly role: number;
  readonly departmentId?: string | null;
  readonly isActive: boolean;
}

export interface ResetPasswordRequest {
  readonly newPassword: string | null;
}

// --- Return obligations ---
export interface ReturnObligationDto {
  readonly id: string;
  readonly userId: string;
  readonly userName: string | null;
  readonly assetInstanceId: string;
  readonly assetCode: string | null;
  readonly modelName: string | null;
  readonly reason: number;
  readonly dueAt: string;
  readonly resolvedAt: string | null;
  readonly resolutionNotes: string | null;
  readonly createdAt: string;
}

export interface ResolveReturnObligationRequest {
  readonly notes?: string | null;
}

// --- Disposals ---
export interface DisposalDto {
  readonly id: string;
  readonly assetInstanceId: string;
  readonly assetCode: string | null;
  readonly disposalType: number;
  readonly soldToUserId: string | null;
  readonly soldToUserName: string | null;
  readonly salePrice: number | null;
  readonly reason: string | null;
  readonly disposedAt: string;
  readonly createdAt: string;
}

// --- Reports ---
export interface StatusCount {
  readonly status: number;
  readonly count: number;
}

export interface CategoryCount {
  readonly category: number;
  readonly count: number;
}

export interface DashboardStatsDto {
  readonly totalAssets: number;
  readonly inStock: number;
  readonly allocated: number;
  readonly lockedTemp: number;
  readonly maintenance: number;
  readonly endOfLife: number;
  readonly pendingRequests: number;
  readonly totalAcquisitionCost: number;
  readonly byStatus: readonly StatusCount[] | null;
  readonly byCategory: readonly CategoryCount[] | null;
}

export interface IdleAssetItem {
  readonly assetInstanceId: string;
  readonly assetCode: string | null;
  readonly modelName: string | null;
  readonly category: number;
  readonly status: number;
  readonly location: string | null;
  readonly acquisitionCost: number;
  readonly acquisitionDate: string;
  readonly lastActivityAt: string | null;
  readonly idleMonths: number;
}

export interface DepreciationPolicyDto {
  readonly id: string;
  readonly assetModelId: string;
  readonly method: number;
  readonly usefulLifeMonths: number;
  readonly annualDeclineRate: number | null;
  readonly salvageValuePercent: number;
  readonly effectiveFrom: string;
  readonly effectiveTo: string | null;
}

export type PutDepreciationPolicyRequest = Omit<DepreciationPolicyDto, 'id' | 'assetModelId'>;

export interface AssetDepreciationDto {
  readonly assetInstanceId: string;
  readonly assetCode: string;
  readonly acquisitionCost: number;
  readonly salvageValue: number;
  readonly bookValue: number;
  readonly accumulatedDepreciation: number;
  readonly asOfDate: string;
  readonly isLedgerValue: boolean;
  readonly remainingUsefulLifeMonths: number;
  readonly fullyDepreciated: boolean;
  readonly nearEndOfLife: boolean;
  readonly needsUpgrade: boolean;
  readonly policy: DepreciationPolicyDto;
}

export interface DepreciationAlertItem {
  readonly assetInstanceId: string;
  readonly assetCode: string;
  readonly modelName: string;
  readonly holderName: string | null;
  readonly departmentId: string | null;
  readonly bookValue: number;
  readonly remainingUsefulLifeMonths: number;
  readonly fullyDepreciated: boolean;
  readonly nearEndOfLife: boolean;
  readonly needsUpgrade: boolean;
}

export interface AssetMatrixItem {
  readonly assetInstanceId: string;
  readonly assetCode: string;
  readonly modelName: string;
  readonly category: number;
  readonly status: number;
  readonly location: string | null;
  readonly holderId: string | null;
  readonly holderName: string | null;
  readonly departmentId: string | null;
  readonly departmentName: string | null;
}

export interface AllocationTimelineItem {
  readonly allocationId: string;
  readonly assetInstanceId: string;
  readonly assetCode: string;
  readonly modelName: string;
  readonly userId: string;
  readonly userName: string;
  readonly departmentId: string | null;
  readonly departmentName: string | null;
  readonly eventType: number;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly expectedReturnAt: string | null;
}

export interface InventoryScanItemDto {
  readonly id: string;
  readonly assetInstanceId: string | null;
  readonly assetCode: string;
  readonly result: number;
  readonly scannedAt: string;
}

export interface InventoryScanDto {
  readonly id: string;
  readonly departmentId: string | null;
  readonly departmentName: string | null;
  readonly status: number;
  readonly startedAt: string;
  readonly closedAt: string | null;
  readonly found: number;
  readonly missing: number;
  readonly unexpected: number;
  readonly items: readonly InventoryScanItemDto[];
}
