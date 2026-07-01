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
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
