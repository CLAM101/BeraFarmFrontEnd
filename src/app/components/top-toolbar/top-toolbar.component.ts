import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EthersService } from '../../services/ethers-service/ethers-service.service';
import { MetaMaskInpageProvider } from '@metamask/providers';

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

  provider: any;
  tokenMethodCaller: any;
  tokenContract: any;
  signer: any;
  accounts: Array<string>;
  walletConnected: boolean;
  constructor(public router: Router, public ethersService: EthersService) {}

  async ngOnInit(): Promise<void> {
    //this.provider = this.ethersService.getProvider();
    //this.onNetworkChanged();
    // if (window.ethereum.selectedAddress && window.ethereum.isConnected()) {
    //   //  await this.connectContracts();
    // } else {
    //   //  alert('Please connect wallet');
    // }
  }

  // async connectContracts() {
  //   this.tokenContract = this.ethersService.getTokenContract(this.provider);
  //   this.signer = await this.provider.getSigner();
  //   this.tokenMethodCaller = this.tokenContract.connect(this.signer);
  // }

  //capture the event emitted when suer changes network and log which network user changed to
  async onNetworkChanged() {
    window.ethereum.on('chainChanged', (chainId: string) => {
      let convertedChainId: number = parseInt(chainId, 16);

      if (convertedChainId !== 5) {
        alert('Please change to the correct network');
        this.changeNetwork();
      }
    });
  }

  //promt user to change networks if they are not on the correct network
  async changeNetwork() {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x5' }],
    });
  }

  async connectWallet() {
    this.ethersService.connectWallet();
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
