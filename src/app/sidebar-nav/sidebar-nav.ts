import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NAV_GROUPS } from '../config/nav-items';
import { NavGroup, Role } from '../models/nav-item';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './sidebar-nav.html',
  styleUrl: './sidebar-nav.css',
})
export class SidebarNav {
  // TODO: replace with AuthService.getCurrentRole() once auth module is built
  private currentRole: Role = 'Employee';

  visibleGroups: NavGroup[] = NAV_GROUPS
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(this.currentRole)),
    }))
    .filter(group => group.items.length > 0);
}