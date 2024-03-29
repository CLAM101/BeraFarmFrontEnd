import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MintConfig } from 'src/app/services/minting-service/mint-config-models';
import { EthersService } from 'src/app/services/ethers-service/ethers-service.service';
import { beraFarm } from 'src/app/services/ethers-service/contracts';
import { ethers, parseEther } from 'ethers';
import { Store } from '@ngrx/store';
import { selectAllContracts } from 'src/global-state/selectors';
import { reinitializeContracts } from 'src/global-state/actions';
import { GameServiceService } from 'src/app/services/game-service/game-service.service';
import { LoadingPopupComponent } from '../loading-popup/loading-popup.component';
@Component({
  selector: 'app-mint-panel',

  templateUrl: './mint-panel.component.html',
  styleUrl: './mint-panel.component.css',
})
export class MintPanelComponent {
  @ViewChild(LoadingPopupComponent) loadingPopup: LoadingPopupComponent;
  mintPanelConfig: MintConfig;
  showMintPanel = false;
  mintAmount = 0;
  beraFarmContract: any;
  beraFarmMethodCaller: any;
  honeyContract: any;
  honeyMethodCaller: any;
  beraCubContract: any;
  beraCubMethodCaller: any;
  fuzzTokenContract: any;
  fuzzTokenMethodCaller: any;
  signer: any;
  provider: any;
  panelType: string;
  allowanceSufficient = false;
  mintCost = '0';
  remainingSupply: number;
  walletCubBalance: number;
  costPerCub: number;
  $contracts: any;
  currentAllowance;
  loading = false;
  loadingText = 'Loading...';
  transactionResponse: string;

  constructor(
    public router: Router,
    public ethersService: EthersService,
    private store: Store,
    private gameService: GameServiceService,
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

    this.walletCubBalance = await this.gameService.getCubBalance(this.beraCubContract);
    this.getMintCost();
  }
  open() {
    this.showMintPanel = true;
  }
  close() {
    this.showMintPanel = false;
  }

  setupContracts() {}

  incrMintAmount() {
    if (this.mintAmount < 20 && this.mintAmount + this.walletCubBalance < 20) this.mintAmount++;
    this.checkAllowance();
    this.getMintCost();
  }

  decrMintAmount() {
    if (this.mintAmount > 0) this.mintAmount--;
    this.checkAllowanceHoney();
    this.getMintCost();
  }

  async ngOnDestroy() {
    await this.ethersService.unSubscribeContracts();
  }

  async getCostPerCubHoney() {
    return this.remainingSupply > 2500 ? 5 : 10;
  }

  async approveSpendHoney() {
    try {
      await this.ethersService.checkAndChangeNetwork();
      const approvalAmount = await this.getTransactionCostHoney();

      if (approvalAmount === 0) return;
      const approvalTx = await this.honeyMethodCaller.approve(beraFarm, approvalAmount);
      this.loadingPopup.visible = true;
      this.loadingPopup.loadingStart = true;

      const approveTxResponse = await approvalTx.wait();

      this.loadingPopup.loadingStart = false;
      this.loadingPopup.response = 'Tokens Approved';

      this.allowanceSufficient = true;
    } catch (err) {
      console.log('error approving spend', err);
    }
  }

  closePopUpClick(e) {
    this.loadingPopup.visible = false;
  }

  async getMintCost() {
    if (this.panelType === 'buyForHoney') {
      const fetchedCost = await this.getTransactionCostHoney();
      this.mintCost = ethers.formatEther(fetchedCost);
      this.costPerCub = await this.getCostPerCubHoney();
    }
    if (this.panelType === 'buyForFuzz') {
      const fetchedCost = await this.getTransactionCostFuzz();
      this.mintCost = fetchedCost;
      this.costPerCub = parseFloat(
        ethers.formatEther(await this.gameService.getCostPerCubFuzz(this.beraFarmContract)),
      );
    }
    if (this.panelType === 'bondForHoney') {
      const fetchedCost = await this.getTransactionCostBond();
      this.mintCost = fetchedCost;
      this.costPerCub = await this.getBondCost();
    }
  }

  async setRemainingSupply() {
    if (this.panelType === 'buyForHoney') {
      this.remainingSupply = await this.getRemainingSupplyHoney();
    }
    if (this.panelType === 'buyForFuzz') {
      this.remainingSupply = await this.gameService.getGeneralRemainingSupply(this.beraCubContract);
    }
    if (this.panelType === 'bondForHoney') {
      this.remainingSupply = await this.gameService.getGeneralRemainingSupply(this.beraCubContract);
    }
  }

  async checkAllowance() {
    if (this.panelType === 'buyForHoney') {
      this.checkAllowanceHoney();
    }
    if (this.panelType === 'buyForFuzz') {
      this.checkAllowanceFuzz();
    }
    if (this.panelType === 'bondForHoney') {
      this.checkAllowanceHoney();
    }
  }
  async approveSpendBond() {
    try {
      await this.ethersService.checkAndChangeNetwork();
      const approvalAmount = ethers.parseEther(await this.getTransactionCostBond());
      const approvalTx = await this.honeyMethodCaller.approve(beraFarm, approvalAmount);

      await approvalTx.wait();
      this.allowanceSufficient = true;
      alert('Tokens Approved');
    } catch (err) {
      console.log('error approving spend for bond', err);
    }
  }

  async approveSpendFuzz() {
    try {
      await this.ethersService.checkAndChangeNetwork();
      const approvalAmount = ethers.parseEther(await this.getTransactionCostFuzz());
      const approvalTx = await this.fuzzTokenMethodCaller.approve(beraFarm, approvalAmount);
      this.loadingPopup.visible = true;
      this.loadingPopup.loadingStart = true;

      await approvalTx.wait();

      this.loadingPopup.response = 'Tokens Approved';
      alert('Tokens Approved');
      this.allowanceSufficient = true;
    } catch (err) {
      console.log('error approving spend', err);
    }
  }

  async checkAllowanceHoney() {
    const currentPlayerAllowance = await this.honeyContract.allowance(
      window.ethereum.selectedAddress,
      beraFarm,
    );

    let mintAmountCost;

    if (this.panelType === 'buyForHoney') {
      mintAmountCost = await this.getTransactionCostHoney();
    }

    if (this.panelType === 'bondForHoney') {
      mintAmountCost = await this.getTransactionCostBond();
    }

    if (mintAmountCost === 0) this.allowanceSufficient = false;

    if (currentPlayerAllowance >= mintAmountCost) {
      this.allowanceSufficient = true;
    } else {
      this.allowanceSufficient = false;
    }
  }

  async checkAllowanceFuzz(): Promise<void> {
    const currentPlayerAllowance = parseFloat(
      ethers.formatEther(
        await this.fuzzTokenContract.allowance(window.ethereum.selectedAddress, beraFarm),
      ),
    );

    const mintAmountCost = parseFloat(await this.getTransactionCostFuzz());

    if (mintAmountCost === 0) this.allowanceSufficient = false;

    if (currentPlayerAllowance >= mintAmountCost) {
      this.allowanceSufficient = true;
    } else {
      this.allowanceSufficient = false;
    }
  }

  async buyBeraCubsForHoney() {
    try {
      await this.ethersService.checkAndChangeNetwork();
      const buyTx = await this.beraFarmMethodCaller.buyBeraCubsHoney(this.mintAmount);
      const confirmation = await buyTx.wait();
      alert('Bought For Honey');
      this.allowanceSufficient = false;
      this.mintAmount = 0;
      await this.postBuyDetailUpdate();
    } catch (err) {
      alert(`Buy For Honey Failed ${err}`);
    }
  }

  async postBuyDetailUpdate() {
    this.walletCubBalance = await this.gameService.getCubBalance(this.beraCubContract);
    await this.setRemainingSupply();
    await this.getMintCost();
    this.mintAmount = 0;
    this.mintCost = '0';
  }

  async buyBeraCubsForFuzz() {
    try {
      await this.ethersService.checkAndChangeNetwork();
      const buyTx = await this.beraFarmMethodCaller.buyBeraCubsFuzz(this.mintAmount);
      const confirmation = await buyTx.wait();
      await this.postBuyDetailUpdate();
    } catch (err) {
      alert(`Buy For Fuzz Failed ${err}`);
    }
  }

  async bondForHoney() {
    try {
      await this.ethersService.checkAndChangeNetwork();
      const bondTx = await this.beraFarmMethodCaller.bondBeraCubs(this.mintAmount);
      const confirmation = await bondTx.wait();
      await this.postBuyDetailUpdate();
    } catch (err) {
      alert(`Bond For Honey Failed ${err}`);
    }
  }

  async getTransactionCostHoney() {
    const currentTotalSupply = await this.beraCubContract.totalSupply();

    const convertedTotalSupply = parseInt(ethers.formatUnits(currentTotalSupply, 0));

    const totalSupplyPlusAmount = convertedTotalSupply + this.mintAmount;

    if (totalSupplyPlusAmount === 0) return 0;

    return await this.beraFarmContract.getHoneyBuyTransactionCost(
      convertedTotalSupply,
      totalSupplyPlusAmount,
      this.mintAmount,
    );
  }

  async getTransactionCostBond() {
    const bondCost = await this.getBondCost();

    const finalBondCost = bondCost * this.mintAmount;

    return finalBondCost.toFixed(2).toString();
  }

  async getBondCost(): Promise<number> {
    return parseFloat(ethers.formatEther(await this.beraFarmContract.getBondCost()));
  }

  async getTransactionCostFuzz(): Promise<string> {
    const currentMintCost = await this.gameService.getCostPerCubFuzz(this.beraFarmContract);

    const mintCost = parseFloat(ethers.formatEther(currentMintCost));

    const finalMintCost = mintCost * this.mintAmount;

    return finalMintCost.toFixed(2);
  }

  async getRemainingSupplyHoney() {
    const currentTotalSupply = await this.beraCubContract.totalSupply();

    const convertedTotalSupply = parseInt(ethers.formatUnits(currentTotalSupply, 0));

    const maxHoneySupply = await this.beraFarmContract.maxSupplyForHoney();

    const convertedHoneySupply = parseInt(ethers.formatUnits(maxHoneySupply, 0));

    return convertedHoneySupply - convertedTotalSupply < 0
      ? 0
      : convertedHoneySupply - convertedTotalSupply;
  }

  async getGeneralRemainingSupply() {
    const currentTotalSupply = await this.beraCubContract.totalSupply();

    const convertedTotalSupply = parseInt(ethers.formatUnits(currentTotalSupply, 0));

    const maxSupply = await this.beraCubContract.maxSupply();

    const convertedMaxSupply = parseInt(ethers.formatUnits(maxSupply, 0));

    return convertedMaxSupply - convertedTotalSupply;
  }
}
