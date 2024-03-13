import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopToolbarComponent } from './components/top-toolbar/top-toolbar.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { BuyPageComponent } from './components/buy-page/buy-page.component';
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
@Component({
  selector: 'app-root',

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'BeraFarmFrontEnd';
}
