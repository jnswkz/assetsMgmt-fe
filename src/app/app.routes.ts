import { Routes } from '@angular/router';
import { DashboardPage } from './dashboard-page/dashboard-page';
import { LoginPage } from './login-page/login-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'dashboard',
    component: DashboardPage,
  },
  {
    path: 'assets/catalog',
    loadComponent: () => import('./asset-catalog-page/asset-catalog-page').then(m => m.AssetCatalogPage),
  },
  {
    path: 'assets/mine',
    loadComponent: () => import('./my-assets-page/my-assets-page').then(m => m.MyAssetsPage),
  },
  {
    path: 'assets',
    loadComponent: () => import('./assets-page/assets-page').then(m => m.AssetsPage),
  },
  {
    path: 'requests/mine',
    loadComponent: () => import('./my-requests-page/my-requests-page').then(m => m.MyRequestsPage),
  },
  {
    path: 'requests/approvals',
    loadComponent: () =>
      import('./pending-approvals-page/pending-approvals-page').then(m => m.PendingApprovalsPage),
  },
  {
    path: 'management/allocations',
    loadComponent: () =>
      import('./allocation-history-page/allocation-history-page').then(m => m.AllocationHistoryPage),
  },
  {
    path: 'management/disposals',
    loadComponent: () => import('./disposals-page/disposals-page').then(m => m.DisposalsPage),
  },
  {
    path: 'management/departments',
    loadComponent: () => import('./departments-page/departments-page').then(m => m.DepartmentsPage),
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./users-page/users-page').then(m => m.UsersPage),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
