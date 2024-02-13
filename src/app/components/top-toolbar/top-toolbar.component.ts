import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './top-toolbar.component.html',
  styleUrl: './top-toolbar.component.css',
})
export class TopToolbarComponent {
  constructor(public router: Router) {}
}
