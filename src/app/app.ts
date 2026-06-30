import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarNav } from './sidebar-nav/sidebar-nav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatToolbarModule, SidebarNav],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}