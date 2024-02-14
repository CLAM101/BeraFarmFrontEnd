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
  soonText = 'COMING SOON';
  connectWalletText = 'CONNECT WALLET';
  getFuzzText = 'GET $FUZZ';
  getCubsText = 'GET CUBS';
  homeText = 'HOME';
  constructor(public router: Router) {}

  mouseUp(button: string) {
    if (button === 'connectWallet') {
      this.connectWalletText = 'CONNECT WALLET';
      return;
    }
    if (button === 'getFuzz') {
      this.getFuzzText = 'GET $FUZZ';
      return;
    }
    if (button === 'getCubs') {
      this.getCubsText = 'GET CUBS';
      return;
    }
  }

  mouseDown(button: string) {
    if (button === 'connectWallet') {
      this.connectWalletText = this.soonText;
      return;
    }
    if (button === 'getFuzz') {
      this.getFuzzText = this.soonText;
      return;
    }
    if (button === 'getCubs') {
      this.getCubsText = this.soonText;
      return;
    }
  }
}
