import { Routes } from '@angular/router';
import { DashboardPage } from './dashboard-page/dashboard-page';
import { ForbiddenPage } from './forbidden-page/forbidden-page';
import { LoginPage } from './login-page/login-page';
import { authGuard, guestGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
    canActivate: [guestGuard],
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [authGuard],
  },
  {
    path: 'assistant',
    canActivate: [authGuard],
    loadComponent: () => import('./assistant-page/assistant-page').then(m => m.AssistantPage),
  },
  {
    path: 'assets/catalog',
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['AdminIT', 'Manager'] },
    loadComponent: () => import('./asset-catalog-page/asset-catalog-page').then(m => m.AssetCatalogPage),
  },
  {
    path: 'assets/mine',
    canActivate: [authGuard],
    loadComponent: () => import('./my-assets-page/my-assets-page').then(m => m.MyAssetsPage),
  },
  {
    path: 'assets',
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['AdminIT', 'Manager'] },
    loadComponent: () => import('./assets-page/assets-page').then(m => m.AssetsPage),
  },
  {
    path: 'requests/mine',
    canActivate: [authGuard],
    loadComponent: () => import('./my-requests-page/my-requests-page').then(m => m.MyRequestsPage),
  },
  {
    path: 'requests/approvals',
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['AdminIT', 'Manager'] },
    loadComponent: () =>
      import('./pending-approvals-page/pending-approvals-page').then(m => m.PendingApprovalsPage),
  },
  {
    path: 'management/allocations',
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['AdminIT', 'Manager'] },
    loadComponent: () =>
      import('./allocation-history-page/allocation-history-page').then(m => m.AllocationHistoryPage),
  },
  {
    path: 'management/disposals',
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['AdminIT', 'Manager'] },
    loadComponent: () => import('./disposals-page/disposals-page').then(m => m.DisposalsPage),
  },
  {
    path: 'management/departments',
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['AdminIT', 'Manager'] },
    loadComponent: () => import('./departments-page/departments-page').then(m => m.DepartmentsPage),
  },
  {
    path: 'admin/users',
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['AdminIT'] },
    loadComponent: () => import('./users-page/users-page').then(m => m.UsersPage),
  },
  {
    path: 'forbidden',
    component: ForbiddenPage,
    canActivate: [authGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
