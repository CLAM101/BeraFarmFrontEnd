import { Attribute, Injectable } from '@angular/core';

import { BrowserProvider, ethers } from 'ethers';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EthersService {
  constructor() {}

  getProvider(): BrowserProvider {
    return new ethers.BrowserProvider(window.ethereum);
  }

  // getCasinoContract(provider: any) {
  //   return new ethers.Contract(casino, casinoAbi, provider);
  // }

  // getTokenContract(provider: any) {
  //   return new ethers.Contract(token, tokenAbi, provider);
  // }

  async connectWallet() {
    let provider: any = this.getProvider();
    try {
      await provider.send('eth_requestAccounts', []);
    } catch (err) {
      console.log('wallet connect error', err);
    }
  }
}
