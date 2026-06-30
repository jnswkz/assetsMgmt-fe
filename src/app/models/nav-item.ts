export interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: Role[];
}

export interface NavGroup {
  label: string;       // section header e.g. "ASSETS"
  roles: Role[];        // optional shortcut, derived from children too
  items: NavItem[];
}

export type Role = 'AdminIT' | 'Manager' | 'Employee';