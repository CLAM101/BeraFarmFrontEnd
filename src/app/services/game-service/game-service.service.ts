import { Injectable } from '@angular/core';
import { EthersService } from '../ethers-service/ethers-service.service';
import { ethers } from 'ethers';
@Injectable({
  providedIn: 'root',
})
export class GameServiceService {
  constructor(private ethersService: EthersService) {}

  async getCubBalance(beraCubContract: any): Promise<number> {
    const cubBalance = await beraCubContract.balanceOf(window.ethereum.selectedAddress);

    return parseInt(ethers.formatUnits(cubBalance, 0));
  }

  async getGeneralRemainingSupply(beraCubContract: any): Promise<number> {
    const currentTotalSupply = await beraCubContract.totalSupply();

    const convertedTotalSupply = parseInt(ethers.formatUnits(currentTotalSupply, 0));

    const maxSupply = await beraCubContract.maxSupply();

    const convertedMaxSupply = parseInt(ethers.formatUnits(maxSupply, 0));

    return convertedMaxSupply - convertedTotalSupply;
  }

  async getTotalCurrentEmissions(beraCubContract: any, beraFarmContract: any) {
    const currentMaxSupply = await beraCubContract.maxSupply();

    const convertedMaxSupply = parseInt(ethers.formatUnits(currentMaxSupply, 0));

    const remainingCubSupply = await this.getGeneralRemainingSupply(beraCubContract);

    const emissionsPerCub = await this.getEmissionsPerCub(beraFarmContract);

    return (convertedMaxSupply - remainingCubSupply) * emissionsPerCub;
  }

  async getFuzzBalance(fuzzTokenContract: any): Promise<string> {
    return parseFloat(
      ethers.formatEther(await fuzzTokenContract.balanceOf(window.ethereum.selectedAddress)),
    ).toFixed(2);
  }

  async getTotalBurned(fuzzTokenContract: any): Promise<number> {
    return parseFloat(ethers.formatEther(await fuzzTokenContract.totalBurned()));
  }

  async getEmissionsPerCub(beraFarmContract: any): Promise<number> {
    return parseFloat(ethers.formatEther(await beraFarmContract.currentDailyRewards()));
  }

  async getUnclaimedRewards(beraFarmContract: any): Promise<number> {
    return parseFloat(
      ethers.formatEther(await beraFarmContract.getTotalClaimable(window.ethereum.selectedAddress)),
    );
  }

  async getCostPerCubFuzz(beraFarmContract: any): Promise<number> {
    return await beraFarmContract.maxCompoundCostSoFar();
  }

  async getPlayerCompoundCost(beraFarmContract: any): Promise<number> {
    return parseFloat(
      ethers.formatEther(
        await beraFarmContract.getWalletCompoundCost(window.ethereum.selectedAddress),
      ),
    );
  }

  async getFuzzPrice(beraFarmContract: any): Promise<number> {
    return parseFloat(ethers.formatEther(await beraFarmContract.getFuzzPrice()));
  }
}
