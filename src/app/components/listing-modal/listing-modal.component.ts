import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { GameServiceService } from 'src/app/services/game-service/game-service.service';
import { LoadingPopupComponent } from '../loading-popup/loading-popup.component';
import { beraCub, marketPlace } from 'src/app/services/ethers-service/contracts';
import { ethers } from 'ethers';

@Component({
  selector: 'app-listing-modal',
  templateUrl: './listing-modal.component.html',
  styleUrl: './listing-modal.component.css',
})
export class ListingModalComponent {
  @ViewChild(LoadingPopupComponent) loadingPopup: LoadingPopupComponent;
  @Output() closeListingModal = new EventEmitter<boolean>();
  @Input() nftMarketMethodCaller: any;
  @Input() beraCubContract: any;
  @Input() beraCubMethodCaller: any;
  @Input() listingsArray: any;
  @Input() mainListing: any;
  @Output() cubListed = new EventEmitter<boolean>();

  listPrice: number | null = null; // Initialize the variable
  ownedTokenIds: string[] | null = null; // Initialize the variable
  tokenBalance: number | null = null; // Initialize the variable
  cubsApproved: boolean = false; // Initialize the variable
  constructor(private gameService: GameServiceService) {}

  async ngOnInit(): Promise<void> {
    await this.initializeData();
  }

  closeModal() {
    this.closeListingModal.emit(false);
  }

  async initializeData() {
    this.tokenBalance = await this.gameService.getCubBalance(this.beraCubContract);
    this.ownedTokenIds = await this.getUserTokenIds();
    this.ownedTokenIds = this.filterTokenIdsFromListings();
    this.cubsApproved = await this.checkApprovalStatus();
  }

  async getUserTokenIds(): Promise<string[]> {
    try {
      let tokenIds = [];

      for (let i = 0; i < this.tokenBalance; i++) {
        let tokenId = await this.beraCubContract.tokenOfOwnerByIndex(
          window.ethereum.selectedAddress,
          i,
        );

        tokenIds.push(tokenId);
      }

      return tokenIds;
    } catch (error) {
      console.log('error fetching token Ids', error);
      return [];
    }
  }

  closePopUpClick(e) {
    this.loadingPopup.visible = false;
  }

  filterTokenIdsFromListings() {
    return this.ownedTokenIds.filter((tokenId) => {
      let existingListing = this.listingsArray?.find((item) => {
        const match = ethers.formatUnits(item.tokenId, 0) === ethers.formatUnits(tokenId, 0);

        return match;
      });

      if (!existingListing) {
        existingListing = this.mainListing?.tokenId === tokenId;
      }

      if (existingListing) {
        return false;
      }
      return true;
    });
  }

  async checkApprovalStatus(): Promise<boolean> {
    return await this.beraCubContract.isApprovedForAll(
      window.ethereum.selectedAddress,
      marketPlace,
    );
  }

  async listItem() {
    try {
      this.loadingPopup.startLoading('Listing Cub');
      const listingTx = await this.nftMarketMethodCaller.listItem(
        beraCub,
        this.ownedTokenIds[0],
        this.listPrice,
      );
      await listingTx.wait();
      this.loadingPopup.finishLoading('Listing Successful', true);
      await this.initializeData();
      this.listPrice = null;
      await this.initializeData();
      this.cubListed.emit(true);
    } catch (error) {
      console.log('error listing item', error);
    }
  }

  async approveCubsForMarketPlace() {
    try {
      this.loadingPopup.startLoading('Approving All');
      const approvalTx = await this.beraCubMethodCaller.setApprovalForAll(marketPlace, true);
      await approvalTx.wait();
      await this.initializeData();
      this.loadingPopup.finishLoading('Approval Successful', true);
      this.cubsApproved = true;
    } catch (error) {
      console.log('error approving cub for marketplace', error);
    }
  }
}
