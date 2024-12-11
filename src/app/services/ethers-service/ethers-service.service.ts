import { Attribute, Injectable } from '@angular/core';
import { BrowserProvider, ethers } from 'ethers';
import { Observable, Subject } from 'rxjs';
import { beraFarm, fuzzToken, mockHoney, beraCub, marketPlace } from './contracts';
import { beraFarmABI, tokenABI, mockHoneyABI, beraCubABI, nftMarketABI } from './abis';
import { Store } from '@ngrx/store';
import { reinitializeContracts } from 'src/global-state/actions';
import { selectAllContracts } from 'src/global-state/selectors';

interface Contracts {
  beraFarmContract: any;
  beraFarmMethodCaller: any;
  beraCubContract: any;
  beraCubMethodCaller: any;
  honeyContract: any;
  honeyMethodCaller: any;
  fuzzTokenContract: any;
  fuzzTokenMethodCaller: any;
  nftMarketContract: any;
  nftMarketMethodCaller: any;
}
@Injectable({
  providedIn: 'root',
})
export class EthersService {
  constructor(private store: Store) {}

  $contracts: Observable<any>;
  beraFarmContract;
  beraFarmMethodCaller;
  beraCubContract;
  beraCubMethodCaller;
  honeyContract;
  honeyMethodCaller;
  fuzzTokenContract;
  fuzzTokenMethodCaller;
  nftMarketContract;
  nftMarketMethodCaller;

  async getProvider(): Promise<BrowserProvider> {
    return new ethers.BrowserProvider(window.ethereum);
  }

  getBeraFarmContract(provider: any) {
    return new ethers.Contract(beraFarm, beraFarmABI, provider);
  }

  getTokenContract(provider: any) {
    return new ethers.Contract(fuzzToken, tokenABI, provider);
  }

  getHoneyContract(provider: any) {
    return new ethers.Contract(mockHoney, mockHoneyABI, provider);
  }

  getBeraCubContract(provider: any) {
    return new ethers.Contract(beraCub, beraCubABI, provider);
  }

  getNftMarketContract(provider: any) {
    return new ethers.Contract(marketPlace, nftMarketABI, provider);
  }

  //promt user to change networks if they are not on the correct network
  async changeNetwork() {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x138D4' }],
    });

    this.store.dispatch(reinitializeContracts());
  }

  async onNetworkChanged() {
    window.ethereum.on('chainChanged', (chainId: string) => {
      let convertedChainId: number = parseInt(chainId, 16);

      if (convertedChainId !== 80084) {
        this.changeNetwork();
      }
    });
  }

  async checkAndChangeNetwork() {
    if (window.ethereum.chainId !== '0x138D4') {
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

  async setupContracts(): Promise<Contracts> {
    this.$contracts = this.store.select(selectAllContracts);
    const provider = await this.getProvider();
    const signer = await provider.getSigner();
    this.$contracts.subscribe((contracts) => {
      if (
        contracts.beraFarmContract &&
        contracts.honeyContract &&
        contracts.fuzzTokenContract &&
        contracts.beraCubContract &&
        contracts.nftMarketContract
      ) {
        this.beraFarmContract = contracts.beraFarmContract;
        this.beraFarmMethodCaller = this.beraFarmContract.connect(signer);
        this.beraCubContract = contracts.beraCubContract;
        this.beraCubMethodCaller = this.beraCubContract.connect(signer);
        this.honeyContract = contracts.honeyContract;
        this.honeyMethodCaller = this.honeyContract.connect(signer);
        this.fuzzTokenContract = contracts.fuzzTokenContract;
        this.fuzzTokenMethodCaller = this.fuzzTokenContract.connect(signer);
        this.nftMarketContract = contracts.nftMarketContract;
        this.nftMarketMethodCaller = this.nftMarketContract.connect(signer);
      }
    });

    return {
      beraFarmContract: this.beraFarmContract,
      beraFarmMethodCaller: this.beraFarmMethodCaller,
      beraCubContract: this.beraCubContract,
      beraCubMethodCaller: this.beraCubMethodCaller,
      honeyContract: this.honeyContract,
      honeyMethodCaller: this.honeyMethodCaller,
      fuzzTokenContract: this.fuzzTokenContract,
      fuzzTokenMethodCaller: this.fuzzTokenMethodCaller,
      nftMarketContract: this.nftMarketContract,
      nftMarketMethodCaller: this.nftMarketMethodCaller,
    };
  }

  initializeWalletListener() {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length > 0) {
        this.refreshPage();
      }
    });
  }

  refreshPage() {
    window.location.reload();
  }

  removeMetaMaskListeners() {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('accountsChanged', this.refreshPage);
    }
  }

  async unSubscribeContracts() {
    this.$contracts.subscribe().unsubscribe();
  }
}
