import { Attribute, Injectable } from '@angular/core';
import { BrowserProvider, ethers } from 'ethers';
import { Observable, Subject } from 'rxjs';
import { beraFarm, fuzzToken, mockHoney, beraCub } from './contracts';
import { beraFarmABI, tokenABI, standardERC20ABI, beraCubABI } from './abis';

@Injectable({
  providedIn: 'root',
})
export class EthersService {
  constructor() {}

  getProvider(): BrowserProvider {
    return new ethers.BrowserProvider(window.ethereum);
  }

  getBeraFarmContract(provider: any) {
    return new ethers.Contract(beraFarm, beraFarmABI, provider);
  }

  getTokenContract(provider: any) {
    return new ethers.Contract(fuzzToken, tokenABI, provider);
  }

  getHoneyContract(provider: any) {
    return new ethers.Contract(mockHoney, standardERC20ABI, provider);
  }

  getBeraCubContract(provider: any) {
    return new ethers.Contract(beraCub, beraCubABI, provider);
  }

  async connectWallet() {
    let provider: any = this.getProvider();
    try {
      await provider.send('eth_requestAccounts', []);
    } catch (err) {
      console.log('wallet connect error', err);
    }
  }
}
