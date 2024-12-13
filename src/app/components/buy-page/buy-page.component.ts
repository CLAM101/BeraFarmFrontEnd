import { Component, Directive, Input, ViewChild } from '@angular/core';
import { MintPanelComponent } from '../mint-panel/mint-panel.component';
import { EthersService } from 'src/app/services/ethers-service/ethers-service.service';

@Component({
  selector: 'app-buy-page',

  templateUrl: './buy-page.component.html',
  styleUrl: './buy-page.component.css',
})
export class BuyPageComponent {
  @ViewChild(MintPanelComponent) mintPanel: MintPanelComponent;

  showPanel = false;
  enableHoneyBuy = false;
  enableFuzzBuy = false;
  enableHoneyBond = false;
  beraFarmContract;
  honeyContract;

  constructor(public ethersService: EthersService) {}
  async ngOnInit(): Promise<void> {
    const { beraFarmContract, honeyMethodCaller } = await this.ethersService.setupContracts();

    this.beraFarmContract = beraFarmContract;
    this.honeyContract = honeyMethodCaller;

    await this.showAndHideBuyButtons();
  }

  async showAndHideBuyButtons() {
    this.enableHoneyBuy = await this.beraFarmContract.checkHoneyOpen();
    this.enableFuzzBuy = await this.beraFarmContract.checkFuzzOpen();
    this.enableHoneyBond = await this.beraFarmContract.checkBondingOpen();
  }

  async showMintPanelFunc(panelType) {
    this.ethersService.checkAndChangeNetwork();

    if (panelType === 'buyForHoney') {
      this.mintPanel.panelType = 'buyForHoney';
      await this.configureBuyForHoney();
    }

    if (panelType === 'buyForFuzz') {
      this.mintPanel.panelType = 'buyForFuzz';
      await this.configureBuyForFuzz();
    }

    if (panelType === 'bondForHoney') {
      this.mintPanel.panelType = 'bondForHoney';
      await this.configureBondForHoney();
    }

    this.showPanel = true;
  }

  closePanel() {
    this.showPanel = false;
    this.showAndHideBuyButtons();
  }

  async dripHoney() {
    await this.honeyContract.requestTokens();
  }

  async configureBuyForHoney() {
    await this.mintPanel.setRemainingSupply();
    await this.mintPanel.getMintCost();
    this.mintPanel.mintPanelConfig = {
      mintPanelTitle: 'BUY CUBS FOR $HONEY',
      approveText: 'APPROVE $HONEY',
      ticker: '$HONEY',
      buyText: 'BUY FOR $HONEY',
      purchaseInfoText:
        "Purchase a maximum amount of 20 Cubs per wallet for $HONEY token, Berachain's native stablecoin!  There will be a maximum supply of only 5000 Cubs for $HONEY, the rest will need to be compounded, bought for $FUZZ or bonded for $HONEY.",
    };
  }

  async configureBuyForFuzz() {
    await this.mintPanel.setRemainingSupply();
    await this.mintPanel.getMintCost();
    this.mintPanel.mintPanelConfig = {
      mintPanelTitle: 'BUY CUBS FOR $FUZZ',
      approveText: 'APPROVE $FUZZ',
      ticker: '$FUZZ',
      buyText: 'BUY FOR $FUZZ',
      purchaseInfoText:
        'Purchase a maximum amount of 20 Cubs per wallet for $FUZZ token, the official worthless ERC20 fo the $FUZZ farm! Cubs can be purchased for $FUZZ after the initial 5000 CUBS for $HONEY are minted. The cost for $FUZZ will the equivalent to the highest current cost to compound.',
    };
  }

  async configureBondForHoney() {
    await this.mintPanel.setRemainingSupply();
    await this.mintPanel.getMintCost();
    this.mintPanel.mintPanelConfig = {
      mintPanelTitle: 'BOND CUBS FOR $HONEY',
      approveText: 'APPROVE $HONEY',
      ticker: '$HONEY',
      buyText: 'BOND FOR $HONEY',
      purchaseInfoText:
        'Bond a maximum amount of 20 Cubs per wallet for $HONEY token! Cubs can be bonded for $HONEY after the initial 5000 CUBS for the fixed $HONEY price have been minted. The cost in $FUZZ that the 15% discount is calculated on will the equivalent to the highest current cost to compound.',
    };
  }
}
