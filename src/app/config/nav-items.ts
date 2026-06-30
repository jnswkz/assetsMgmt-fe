// nav-items.config.ts
import { NavGroup } from '../models/nav-item';

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'OVERVIEW',
    roles: ['AdminIT', 'Manager', 'Employee'],
    items: [
      { label: 'Dashboard', icon: 'grid_view', route: '/dashboard', roles: ['AdminIT', 'Manager', 'Employee'] },
    ],
  },
  {
    label: 'ASSETS',
    roles: ['AdminIT', 'Manager', 'Employee'],
    items: [
      { label: 'Asset Catalog', icon: 'category', route: '/assets/catalog', roles: ['AdminIT', 'Manager', 'Employee'] },
      { label: 'Assets', icon: 'devices', route: '/assets', roles: ['AdminIT', 'Manager', 'Employee'] },
      { label: 'My Assets', icon: 'person', route: '/assets/mine', roles: ['AdminIT', 'Manager', 'Employee'] },
    ],
  },
  {
    label: 'REQUESTS',
    roles: ['AdminIT', 'Manager', 'Employee'],
    items: [
      { label: 'My Requests', icon: 'assignment', route: '/requests/mine', roles: ['AdminIT', 'Manager', 'Employee'] },
      { label: 'Pending Approvals', icon: 'check_box', route: '/requests/approvals', roles: ['AdminIT', 'Manager'] },
    ],
  },
  {
    label: 'MANAGEMENT',
    roles: ['AdminIT', 'Manager'],
    items: [
      { label: 'Allocation History', icon: 'history', route: '/management/allocations', roles: ['AdminIT', 'Manager'] },
      { label: 'Disposals', icon: 'delete_outline', route: '/management/disposals', roles: ['AdminIT', 'Manager'] },
      { label: 'Departments', icon: 'apartment', route: '/management/departments', roles: ['AdminIT', 'Manager'] },
    ],
  },
  {
    label: 'ADMIN',
    roles: ['AdminIT'],
    items: [
      { label: 'Users', icon: 'group', route: '/admin/users', roles: ['AdminIT'] },
    ],
  },
];