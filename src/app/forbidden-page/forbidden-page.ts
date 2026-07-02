import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forbidden-page',
  imports: [RouterLink, MatIconModule],
  templateUrl: './forbidden-page.html',
  styleUrl: './forbidden-page.css',
})
export class ForbiddenPage {}
