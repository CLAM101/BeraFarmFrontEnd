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

  //promt user to change networks if they are not on the correct network
  async changeNetwork() {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x539' }],
    });
  }

  async onNetworkChanged() {
    window.ethereum.on('chainChanged', (chainId: string) => {
      let convertedChainId: number = parseInt(chainId, 16);

      if (convertedChainId !== 1337) {
        alert('Please change to the correct network');
        this.changeNetwork();
      }
    });
  }

  async checkAndChangeNetwork() {
    if (window.ethereum.chainId !== '0x539') {
      this.changeNetwork();
    }
  }

  async connectWallet() {
    let provider: any = this.getProvider();
    this.checkAndChangeNetwork();
    try {
      await provider.send('eth_requestAccounts', []);
    } catch (err) {
      console.log('wallet connect error', err);
    }
  }
}
