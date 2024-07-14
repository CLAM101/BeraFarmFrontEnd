import { Component, ViewChild } from '@angular/core';
import { GameServiceService } from 'src/app/services/game-service/game-service.service';
import { EthersService } from 'src/app/services/ethers-service/ethers-service.service';
import { ethers } from 'ethers';
import { LoadingPopupComponent } from '../loading-popup/loading-popup.component';

interface Listing {
  id: string;
  seller: string;
  nftContract: string;
  tokenId: string;
  price: number;
  active: true;
}

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.css',
})
export class MarketplaceComponent {
  @ViewChild(LoadingPopupComponent) loadingPopup: LoadingPopupComponent;
  mainItemPrice: number;
  listingsArray: any;
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
  mainListing: Listing;
  userAddress: string;

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
    debugger;
    this.userAddress = window.ethereum.selectedAddress;
    await this.initializeMarketplace();
  }

  async setupListings() {
    const allListings = await this.getListings();

    this.listingsArray = allListings
      .map((listing: Listing) => ({
        id: listing.id,
        seller: listing.seller,
        nftContract: listing.nftContract,
        tokenId: listing.tokenId,
        price: listing.price,
        active: listing.active,
      }))
      .filter((listing) => listing.active);
    debugger;
    if (allListings.length) {
      this.mainListing = this.listingsArray[0];

      this.listingsArray = this.listingsArray.slice(1);
    }
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

  closePopUpClick($event) {
    this.loadingPopup.visible = false;
  }

  async getListings() {
    return await this.nftMarketContract.getActiveListings();
  }

  async buyCub(tokenId: string, listingId: string, price: number, seller: string) {
    try {
      this.loadingPopup.startLoading('Purchasing Cub');
      if (this.userAddress.toLowerCase() === seller.toLowerCase()) {
        this.loadingPopup.finishLoading('You cannot buy your own Cub', false);
        return;
      }
      const buyTx = await this.nftMarketMethodCaller.buyItem(
        this.beraCubContract,
        tokenId,
        listingId,
        { value: price },
      );

      const confirmation = await buyTx.wait();

      this.loadingPopup.finishLoading('Purchase Successful', true);
      this.initializeMarketplace();
    } catch (error) {
      this.loadingPopup.finishLoading('Purchase Failed', false);
    }
  }

  orderListingsByPrice() {
    this.listingsArray = this.listingsArray.sort(
      (a, b) => Number(ethers.formatEther(a.price)) - Number(ethers.formatEther(b.price)),
    );
  }

  async refreshMarketplace(event) {
    this.initializeMarketplace();
  }

  async initializeMarketplace() {
    await this.getCubBalance();

    await this.setupListings();
    this.orderListingsByPrice();
  }
}
