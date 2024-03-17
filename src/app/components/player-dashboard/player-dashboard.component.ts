import { Component } from '@angular/core';
import { EthersService } from 'src/app/services/ethers-service/ethers-service.service';
import { GameServiceService } from 'src/app/services/game-service/game-service.service';
import { CommonModule } from '@angular/common';
import { ethers } from 'ethers';

@Component({
  selector: 'app-player-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-dashboard.component.html',
  styleUrl: './player-dashboard.component.css',
})
export class PlayerDashboardComponent {
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
  unclaimedRewards: number;
  totalBurned: number;
  currentCubPriceForFuzz: number;
  playerCompoundCost: number;

  constructor(
    private ethersService: EthersService,
    private gameService: GameServiceService
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

    this.playerCubBalance = await this.gameService.getCubBalance(
      this.beraCubContract
    );

    this.currentFuzzPrice = await this.gameService.getFuzzPrice(
      this.beraFarmContract
    );

    this.remainingCubSupply = await this.gameService.getGeneralRemainingSupply(
      this.beraCubContract
    );

    this.emissionsPerCub = await this.gameService.getEmissionsPerCub(
      this.beraFarmContract
    );

    this.ownedCubsArray = this.generateOwnedCubsArray();

    this.currentDailyRewards = this.calculateCurrentDailyRewards();

    this.unclaimedRewards = await this.gameService.getUnclaimedRewards(
      this.beraFarmContract
    );

    this.totalBurned = await this.gameService.getTotalBurned(
      this.fuzzTokenContract
    );

    this.currentCubPriceForFuzz = parseFloat(
      ethers.formatEther(
        await this.gameService.getCostPerCubFuzz(this.beraFarmContract)
      )
    );

    this.playerCompoundCost = await this.gameService.getPlayerCompoundCost(
      this.beraFarmContract
    );
  }

  generateOwnedCubsArray() {
    const ownedCubs = [];
    for (let i = 0; i < this.playerCubBalance; i++) {
      ownedCubs.push(i);
    }
    return ownedCubs;
  }

  calculateCurrentDailyRewards() {
    return this.playerCubBalance * this.emissionsPerCub;
  }

  ngOnDestroy(): void {
    this.ethersService.unSubscribeContracts();
  }
}
