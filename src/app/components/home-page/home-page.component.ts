import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',

  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  constructor() {}

  infoPage = false;

  //enum for each button keys as strings

  ngOnInit(): void {}

  showInfo() {
    this.infoPage = true;
  }

  openExternalLink(url: string) {
    window.open(url, '_blank');
  }
}
