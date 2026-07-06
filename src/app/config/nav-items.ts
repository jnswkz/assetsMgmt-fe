import { NavGroup, NavItem } from '../models/nav-item';

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: 'grid_view', route: '/dashboard', roles: ['AdminIT', 'Manager', 'Employee'] },
    ],
  },
  {
    label: 'Assets',
    items: [
      {
        label: 'Asset Catalog',
        icon: 'category',
        route: '/assets/catalog',
        roles: ['AdminIT', 'Manager', 'Employee'],
      },
      { label: 'Assets', icon: 'device_hub', route: '/assets', roles: ['AdminIT', 'Manager', 'Employee'] },
      { label: 'My Assets', icon: 'person', route: '/assets/mine', roles: ['AdminIT', 'Manager', 'Employee'] },
    ],
  },
  {
    label: 'Requests',
    items: [
      { label: 'My Requests', icon: 'assignment', route: '/requests/mine', roles: ['AdminIT', 'Manager', 'Employee'] },
      { label: 'Pending Approvals', icon: 'check_box', route: '/requests/approvals', roles: ['AdminIT', 'Manager'] },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Allocation History', icon: 'history_toggle_off', route: '/management/allocations', roles: ['AdminIT', 'Manager'] },
      { label: 'Disposals', icon: 'delete_outline', route: '/management/disposals', roles: ['AdminIT', 'Manager'] },
      { label: 'Departments', icon: 'apartment', route: '/management/departments', roles: ['AdminIT', 'Manager'] },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Users', icon: 'group', route: '/admin/users', roles: ['AdminIT'] },
    ],
  },
  {
    label: 'Assistant',
    items: [
      { label: 'AI Assistant', icon: 'smart_toy', route: '/assistant', roles: ['AdminIT', 'Manager', 'Employee'] },
    ],
  },
];

export const SETTINGS_NAV_ITEM: NavItem = {
  label: 'Settings',
  icon: 'settings',
  route: '/settings',
  roles: ['AdminIT', 'Manager', 'Employee'],
};
