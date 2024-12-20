import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EthersService } from '../../services/ethers-service/ethers-service.service';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { reinitializeContracts } from 'src/global-state/actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-top-toolbar',
  templateUrl: './top-toolbar.component.html',
  styleUrl: './top-toolbar.component.css',
})
export class TopToolbarComponent {
  soonText = 'COMING SOON';
  connectWalletText = 'CONNECT WALLET';
  getFuzzText = 'GET $FUZZ';
  getCubsText = 'BUY CUBS';
  homeText = 'HOME';

  provider: any;
  tokenMethodCaller: any;
  tokenContract: any;
  signer: any;
  accounts: Array<string>;
  walletConnected: boolean;
  constructor(
    public router: Router,
    public ethersService: EthersService,
    private store: Store,
  ) {}

  async ngOnInit(): Promise<void> {
    this.store.dispatch(reinitializeContracts());
    this.provider = this.ethersService.getProvider();
    this.ethersService.checkAndChangeNetwork();
    this.ethersService.onNetworkChanged();
    this.ethersService.initializeWalletListener();
    if (window.ethereum.selectedAddress && window.ethereum.isConnected()) {
      this.ethersService.connectWallet();
    } else {
    }
  }

  ngOnDestroy() {
    this.ethersService.removeMetaMaskListeners();
  }

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

  connectWallet() {
    this.ethersService.connectWallet();
  }

  getFuzz() {
    window.open('https://bartio.bex.berachain.com/swap', '_blank');
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
