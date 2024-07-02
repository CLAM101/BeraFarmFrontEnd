import { Component } from '@angular/core';
import { GameServiceService } from 'src/app/services/game-service/game-service.service';
import { EthersService } from 'src/app/services/ethers-service/ethers-service.service';

interface Listing {
  seller: string;
  tokenId: number;
  price: number;
  nftAddress: string;
}

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.css',
})
export class MarketplaceComponent {
  mainItemPrice: number;
  listingsArray: Listing[];
  showListingModal = false;
  playerCubBalance: number;
  currentFloorPrice: number;
  signer: any;
  provider: any;
  beraFarmContract: any;
  beraFarmMethodCaller: any;
  honeyContract: any;
  honeyMethodCaller: any;
  beraCubContract: any;
  beraCubMethodCaller: any;
  fuzzTokenContract: any;
  fuzzTokenMethodCaller: any;
  nftMarketContract: any;
  nftMarketMethodCaller: any;

  constructor(
    private gameService: GameServiceService,
    private ethersService: EthersService,
  ) {}

  async ngOnInit(): Promise<void> {
    const {
      beraFarmContract,
      beraFarmMethodCaller,
      beraCubContract,
      beraCubMethodCaller,
      honeyContract,
      honeyMethodCaller,
      fuzzTokenContract,
      fuzzTokenMethodCaller,
      nftMarketContract,
      nftMarketMethodCaller,
    } = await this.ethersService.setupContracts();

    // Assign to component properties
    this.beraFarmContract = beraFarmContract;
    this.beraFarmMethodCaller = beraFarmMethodCaller;
    this.beraCubContract = beraCubContract;
    this.beraCubMethodCaller = beraCubMethodCaller;
    this.honeyContract = honeyContract;
    this.honeyMethodCaller = honeyMethodCaller;
    this.fuzzTokenContract = fuzzTokenContract;
    this.fuzzTokenMethodCaller = fuzzTokenMethodCaller;
    this.nftMarketContract = nftMarketContract;
    this.nftMarketMethodCaller = nftMarketMethodCaller;
    await this.initializeMarketplace();
  }

  setMainItemPrice(price: number) {
    this.mainItemPrice = price;
  }

  async getCubBalance() {
    this.playerCubBalance = await this.gameService.getCubBalance(this.beraCubContract);
  }

  openListingModal() {
    this.showListingModal = true;
  }

  closeListingModal() {
    this.showListingModal = false;
  }

  async getListings() {
    this.listingsArray = await this.nftMarketContract.getActiveListings();
  }

  async initializeMarketplace() {
    this.setMainItemPrice(0);
    await this.getListings();
    await this.getCubBalance();
  }
}
