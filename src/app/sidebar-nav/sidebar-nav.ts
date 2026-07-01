import { Component, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NAV_GROUPS, SETTINGS_NAV_ITEM } from '../config/nav-items';
import { NavGroup, Role } from '../models/nav-item';

@Component({
  selector: 'app-sidebar-nav',
  imports: [RouterModule, MatIconModule],
  templateUrl: './sidebar-nav.html',
  styleUrl: './sidebar-nav.css',
})
export class SidebarNav {
  // TODO: replace with AuthService.getCurrentRole() once auth module is built
  readonly role = input<Role>('Employee');
  protected readonly settingsItem = SETTINGS_NAV_ITEM;

  protected readonly visibleGroups = computed<NavGroup[]>(() =>
    NAV_GROUPS
      .map(group => ({
        ...group,
        items: group.items.filter(item => item.roles.includes(this.role())),
      }))
      .filter(group => group.items.length > 0)
  );
}
