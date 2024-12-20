import { Component, HostListener, ViewChild } from '@angular/core';
import { EthersService } from 'src/app/services/ethers-service/ethers-service.service';
import { GameServiceService } from 'src/app/services/game-service/game-service.service';
import { ethers } from 'ethers';
import { LoadingPopupComponent } from '../loading-popup/loading-popup.component';

@Component({
  selector: 'app-player-dashboard',

  templateUrl: './player-dashboard.component.html',
  styleUrl: './player-dashboard.component.css',
})
export class PlayerDashboardComponent {
  @ViewChild(LoadingPopupComponent) loadingPopup: LoadingPopupComponent;
  beraFarmContract;
  fuzzTokenContract;
  beraCubContract;
  honeyContract;
  beraFarmMethodCaller;
  fuzzTokenMethodCaller;
  beraCubMethodCaller;
  honeyMethodCaller;
  playerCubBalance: number;
  ownedCubsArray: Array<number>;
  currentFuzzPrice: number;
  remainingCubSupply: number;
  emissionsPerCub: number;
  currentDailyRewards: number;
  fuzzBalance: string;
  unclaimedRewards: number;
  totalBurned: string;
  currentCubPriceForFuzz: number;
  playerCompoundCost: number;
  currentTotalEmissions: number;
  showCubGrid;

  constructor(
    private ethersService: EthersService,
    private gameService: GameServiceService,
  ) {}

  @HostListener('window:resize', ['$event'])
  async ngOnInit(): Promise<void> {
    await this.initializeContracts();
    await this.initializeDashboard();
  }

  generateOwnedCubsArray() {
    const ownedCubs = [];
    for (let i = 0; i < this.playerCubBalance; i++) {
      ownedCubs.push(i);
    }
    return ownedCubs;
  }

  closePopUpClick(e) {
    this.loadingPopup.visible = false;
  }

  onResize(event) {
    this.checkSizeAndGenerateCubs();
  }

  private checkScreenSize(width: number) {
    this.showCubGrid = width >= 1280;
  }

  private async initializeContracts() {
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

    this.beraFarmContract = beraFarmContract;
    this.beraFarmMethodCaller = beraFarmMethodCaller;
    this.beraCubContract = beraCubContract;
    this.beraCubMethodCaller = beraCubMethodCaller;
    this.honeyContract = honeyContract;
    this.honeyMethodCaller = honeyMethodCaller;
    this.fuzzTokenContract = fuzzTokenContract;
    this.fuzzTokenMethodCaller = fuzzTokenMethodCaller;
  }

  private async initializeDashboard() {
    this.fuzzBalance = await this.gameService.getFuzzBalance(this.fuzzTokenContract);
    this.playerCubBalance = await this.gameService.getCubBalance(this.beraCubContract);

    this.currentFuzzPrice = await this.gameService.getFuzzPrice(this.beraFarmContract);

    this.remainingCubSupply = await this.gameService.getGeneralRemainingSupply(
      this.beraCubContract,
    );

    this.emissionsPerCub = await this.gameService.getEmissionsPerCub(this.beraFarmContract);

    this.currentDailyRewards = this.calculateCurrentDailyRewards();

    const rewards = await this.gameService.getUnclaimedRewards(this.beraFarmContract);

    this.unclaimedRewards = parseFloat(rewards.toFixed(2));

    this.totalBurned = (await this.gameService.getTotalBurned(this.fuzzTokenContract)).toFixed(2);

    this.currentCubPriceForFuzz = parseFloat(
      ethers.formatEther(await this.gameService.getCostPerCubFuzz(this.beraFarmContract)),
    );

    this.playerCompoundCost = await this.gameService.getPlayerCompoundCost(this.beraFarmContract);

    this.currentTotalEmissions = await this.gameService.getTotalCurrentEmissions(
      this.beraCubContract,
      this.beraFarmContract,
    );

    this.checkSizeAndGenerateCubs();
  }

  checkSizeAndGenerateCubs() {
    this.checkScreenSize(window.innerWidth);

    if (this.showCubGrid) {
      this.ownedCubsArray = this.generateOwnedCubsArray();
    }
  }

  async compoundCub() {
    try {
      this.loadingPopup.startLoading('Compounding Cub');
      const compoundTx = await this.beraFarmMethodCaller.compoundBeraCubs();

      await compoundTx.wait();

      this.loadingPopup.finishLoading('Cub successfully compounded', true);

      await this.initializeDashboard();
    } catch (err) {
      this.loadingPopup.finishLoading(`Error compounding Cub: ${err.reason}`, false);
    }
  }

  async claimRewards() {
    try {
      this.loadingPopup.startLoading('Claiming rewards');
      const claimRewardsTx = await this.beraFarmMethodCaller.claim();

      await claimRewardsTx.wait();

      this.loadingPopup.finishLoading('Rewards successfully claimed', true);
      await this.initializeDashboard();
    } catch (err) {
      this.loadingPopup.finishLoading(`Error claiming rewards: ${err.reason}`, false);
    }
  }

  calculateCurrentDailyRewards() {
    return this.playerCubBalance * this.emissionsPerCub;
  }

  ngOnDestroy(): void {
    this.ethersService.unSubscribeContracts();
  }
}
