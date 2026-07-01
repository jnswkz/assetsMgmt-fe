export interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: Role[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export type Role = 'AdminIT' | 'Manager' | 'Employee';
