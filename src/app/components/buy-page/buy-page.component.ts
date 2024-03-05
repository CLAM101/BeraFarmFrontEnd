import { Component, Directive, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MintPanelComponent } from '../mint-panel/mint-panel.component';
import { EthersService } from 'src/app/services/ethers-service/ethers-service.service';
import { beraFarm } from 'src/app/services/ethers-service/contracts';
import { ethers } from 'ethers';

@Component({
  selector: 'app-buy-page',
  standalone: true,
  imports: [MintPanelComponent, CommonModule],
  templateUrl: './buy-page.component.html',
  styleUrl: './buy-page.component.css',
})
export class BuyPageComponent {
  @ViewChild(MintPanelComponent) mintPanel: MintPanelComponent;

  showPanel;
  constructor(public ethersService: EthersService) {}
  ngOnInit(): void {}

  async showMintPanelFunc(panelType) {
    if (panelType === 'buyForHoney') {
      await this.configureBuyForHoney();
      this.mintPanel.panelType = 'buyForHoney';
    }

    if (panelType === 'buyForFuzz') {
      await this.configureBuyForFuzz();
      this.mintPanel.panelType = 'buyForFuzz';
    }

    if (panelType === 'bondForHoney') {
      await this.configureBondForHoney();
      this.mintPanel.panelType = 'bondForHoney';
    }

    this.mintPanel.open();
  }

  async configureBuyForHoney() {
    this.mintPanel.mintPanelConfig = {
      mintPanelTitle: 'Buy Cubs for $HONEY',
      approveText: 'Approve $HONEY',
      ticker: '$HONEY',
      buyText: 'Buy For Honey',
      purchaseInfoText:
        "Purchase a maximum amount of 20 Cubs per wallet for $HONEY token, Berachain's native stablecoin!",
    };
  }

  async configureBuyForFuzz() {
    this.mintPanel.mintPanelConfig = {
      mintPanelTitle: 'Buy Cubs for $FUZZ',
      approveText: 'Approve $FUZZ',
      ticker: '$FUZZ',
      buyText: 'Buy For Fuzz',
      purchaseInfoText:
        'Purchase a maximum amount of 20 Cubs per wallet for $FUZZ token, the official worthless ERC20 fo the $FUZZ farm!',
    };
  }

  async configureBondForHoney() {
    this.mintPanel.mintPanelConfig = {
      mintPanelTitle: 'Bond $HONEY',
      approveText: 'Approve $HONEY',
      ticker: '$HONEY',
      buyText: 'Bond For $HONEY',
      purchaseInfoText:
        'Bond a maximum amount of 20 Cubs per wallet for $HONEY token at a 15% discount on the current price in $FUZZ!',
    };
  }
}
