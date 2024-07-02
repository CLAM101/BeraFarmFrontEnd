import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { GameServiceService } from 'src/app/services/game-service/game-service.service';
import { LoadingPopupComponent } from '../loading-popup/loading-popup.component';

@Component({
  selector: 'app-listing-modal',
  templateUrl: './listing-modal.component.html',
  styleUrl: './listing-modal.component.css',
})
export class ListingModalComponent {
  @ViewChild(LoadingPopupComponent) loadingPopup: LoadingPopupComponent;
  @Output() closeListingModal = new EventEmitter<boolean>();
  @Input() nftMarketContract: any;
  @Input() cubBalance: number;

  listPrice: number | null = null; // Initialize the variable

  constructor(private gameService: GameServiceService) {}

  ngOnInit(): void {}

  closeModal() {
    this.closeListingModal.emit(false);
  }

  closePopUpClick(e) {
    this.loadingPopup.visible = false;
  }

  async listItem() {}
}
