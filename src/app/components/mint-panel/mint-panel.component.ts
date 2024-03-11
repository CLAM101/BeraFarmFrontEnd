import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MintConfig } from 'src/app/services/minting-service/mint-config-models';
import { EthersService } from 'src/app/services/ethers-service/ethers-service.service';
import { beraFarm } from 'src/app/services/ethers-service/contracts';
import { ethers } from 'ethers';
@Component({
  selector: 'app-mint-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mint-panel.component.html',
  styleUrl: './mint-panel.component.css',
})
export class MintPanelComponent {
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

  constructor(public router: Router, public ethersService: EthersService) {}
  async ngOnInit(): Promise<void> {
    this.provider = this.ethersService.getProvider();
    this.signer = await this.provider.getSigner();
    this.setupContracts();
    this.getCubBalance();
  }
  open() {
    this.showMintPanel = true;
  }
  close() {
    this.showMintPanel = false;
  }

  incrMintAmount() {
    if (this.mintAmount < 20 && this.mintAmount + this.walletCubBalance < 20)
      this.mintAmount++;
    this.checkAllowance();
    this.getMintCost();
  }

  decrMintAmount() {
    if (this.mintAmount > 0) this.mintAmount--;
    this.checkAllowanceHoney();
    this.getMintCost();
  }

  async setupContracts() {
    this.beraFarmContract = this.ethersService.getBeraFarmContract(
      this.provider
    );
    this.beraFarmMethodCaller = this.beraFarmContract.connect(this.signer);

    this.beraCubContract = this.ethersService.getBeraCubContract(this.provider);
    this.beraCubMethodCaller = this.beraCubContract.connect(this.signer);

    this.honeyContract = this.ethersService.getHoneyContract(this.provider);
    this.honeyMethodCaller = this.honeyContract.connect(this.signer);
    this.fuzzTokenContract = this.ethersService.getTokenContract(this.provider);
    this.fuzzTokenMethodCaller = this.fuzzTokenContract.connect(this.signer);
  }

  async getCubBalance() {
    const cubBalance = await this.beraCubContract.balanceOf(
      window.ethereum.selectedAddress
    );

    this.walletCubBalance = parseInt(ethers.formatUnits(cubBalance, 0));
  }

  async getCostPerCubHoney() {
    debugger;
    this.costPerCub = this.remainingSupply > 2500 ? 5 : 10;
  }

  async approveSpendHoney() {
    try {
      await this.ethersService.checkAndChangeNetwork();
      const approvalAmount = await this.getTransactionCostHoney();

      if (approvalAmount === 0) return;
      const approvalTx = await this.honeyMethodCaller.approve(
        beraFarm,
        approvalAmount
      );

      await approvalTx.wait();

      alert('Tokens Approved');
      this.allowanceSufficient = true;
    } catch (err) {
      console.log('error approving spend', err);
    }
  }

  async getMintCost() {
    debugger;
    if (this.panelType === 'buyForHoney') {
      const fetchedCost = await this.getTransactionCostHoney();
      this.mintCost = ethers.formatEther(fetchedCost);
      this.getCostPerCubHoney();
    }
    if (this.panelType === 'buyForFuzz') {
      debugger;
      const fetchedCost = await this.getTransactionCostFuzz();
      this.mintCost = fetchedCost;
    }
    if (this.panelType === 'bondForHoney') {
      const fetchedCost = await this.getTransactionCostBond();
      this.mintCost = fetchedCost;
    }
  }

  async setRemainingSupply() {
    if (this.panelType === 'buyForHoney') {
      this.remainingSupply = await this.getRemainingSupplyHoney();
    }
    if (this.panelType === 'buyForFuzz') {
      this.remainingSupply = await this.getGeneralRemainingSupply();
    }
    if (this.panelType === 'bondForHoney') {
      this.remainingSupply = await this.getGeneralRemainingSupply();
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
      const approvalAmount = await this.getTransactionCostBond();
      const approvalTx = await this.honeyMethodCaller.approve(
        beraFarm,
        approvalAmount
      );

      await approvalTx.wait();

      alert('Tokens Approved');
    } catch (err) {
      console.log('error approving spend for bond', err);
    }
  }

  async approveSpendFuzz() {
    try {
      await this.ethersService.checkAndChangeNetwork();
      const approvalAmount = await this.getTransactionCostFuzz();
      const approvalTx = await this.fuzzTokenMethodCaller.approve(
        beraFarm,
        approvalAmount
      );

      await approvalTx.wait();

      alert('Tokens Approved');
    } catch (err) {
      console.log('error approving spend', err);
    }
  }

  async checkAllowanceHoney() {
    const currentPlayerAllowance = await this.honeyContract.allowance(
      window.ethereum.selectedAddress,
      beraFarm
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

  async checkAllowanceFuzz(): Promise<string> {
    const currentPlayerAllowance = await this.fuzzTokenContract.allowance(
      window.ethereum.selectedAddress,
      beraFarm
    );

    const mintAmountCost = await this.getTransactionCostFuzz();

    if (currentPlayerAllowance >= mintAmountCost) return 'Buy for $FUZZ';

    return 'Approve Spend';
  }

  async buyBeraCubsForHoney() {
    try {
      await this.ethersService.checkAndChangeNetwork();
      const buyTx = await this.beraFarmMethodCaller.buyBeraCubsHoney(
        this.mintAmount
      );
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
    await this.getCubBalance();
    await this.setRemainingSupply();
    await this.getMintCost();
  }

  async buyBeraCubsForFuzz() {
    try {
      await this.ethersService.checkAndChangeNetwork();
      const buyTx = this.beraFarmMethodCaller.buyBeraCubsForFuzz(
        this.mintAmount
      );
      const confirmation = await buyTx.wait();
    } catch (err) {
      alert(`Buy For Fuzz Failed ${err}`);
    }
  }

  async bondForHoney() {
    try {
      await this.ethersService.checkAndChangeNetwork();
      const bondTx = this.beraFarmMethodCaller.bondBeraCubs(this.mintAmount);
      const confirmation = await bondTx.wait();
    } catch (err) {
      alert(`Bond For Honey Failed ${err}`);
    }
  }

  async getTransactionCostHoney() {
    const currentTotalSupply = await this.beraCubContract.totalSupply();

    const convertedTotalSupply = parseInt(
      ethers.formatUnits(currentTotalSupply, 0)
    );

    const totalSupplyPlusAmount = convertedTotalSupply + this.mintAmount;

    if (totalSupplyPlusAmount === 0) return 0;

    return await this.beraFarmContract.getHoneyBuyTransactionCost(
      convertedTotalSupply,
      totalSupplyPlusAmount,
      this.mintAmount
    );
  }

  async getTransactionCostBond() {
    const bondCost = parseFloat(
      ethers.formatEther(await this.beraFarmContract.getBondCost())
    );

    const finalBondCost = bondCost * this.mintAmount;

    return finalBondCost.toFixed(2).toString();
  }

  async getTransactionCostFuzz(): Promise<string> {
    const currentMintCost = await this.beraFarmContract.maxCompoundCostSoFar();

    const mintCost = parseFloat(ethers.formatEther(currentMintCost));

    const finalMintCost = mintCost * this.mintAmount;

    return finalMintCost.toFixed(2).toString();
  }

  async getRemainingSupplyHoney() {
    const currentTotalSupply = await this.beraCubContract.totalSupply();

    const convertedTotalSupply = parseInt(
      ethers.formatUnits(currentTotalSupply, 0)
    );

    const maxHoneySupply = await this.beraFarmContract.maxSupplyForHoney();

    const convertedHoneySupply = parseInt(
      ethers.formatUnits(maxHoneySupply, 0)
    );

    return convertedHoneySupply - convertedTotalSupply < 0
      ? 0
      : convertedHoneySupply - convertedTotalSupply;
  }

  async getGeneralRemainingSupply() {
    const currentTotalSupply = await this.beraCubContract.totalSupply();

    const convertedTotalSupply = parseInt(
      ethers.formatUnits(currentTotalSupply, 0)
    );

    const maxSupply = await this.beraCubContract.maxSupply();

    const convertedMaxSupply = parseInt(ethers.formatUnits(maxSupply, 0));

    return convertedMaxSupply - convertedTotalSupply;
  }
}
