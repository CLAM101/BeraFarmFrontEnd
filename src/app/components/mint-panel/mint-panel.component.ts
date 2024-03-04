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

  constructor(public router: Router, public ethersService: EthersService) {}
  async ngOnInit(): Promise<void> {
    this.provider = this.ethersService.getProvider();
    this.setupContracts();
  }
  open() {
    this.showMintPanel = true;
  }
  close() {
    this.showMintPanel = false;
  }

  incrMintAmount() {
    if (this.mintAmount < 20) this.mintAmount++;
  }

  decrMintAmount() {
    if (this.mintAmount > 0) this.mintAmount--;
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

  async approveSpendHoney() {
    try {
      const approvalAmount = this.getTransactionCostHoney();
      const approvalTx = await this.honeyMethodCaller.approve(
        beraFarm,
        approvalAmount
      );

      await approvalTx.wait();

      alert('Tokens Approved');
    } catch (err) {
      console.log('error approving spend', err);
    }
  }

  async approveSpendBond() {
    try {
      const approvalAmount = this.getTransactionCostBond();
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
      const approvalAmount = this.getTransactionCostFuzz();
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

  async checkAllowanceHoney(): Promise<string> {
    const currentPlayerAllowance = await this.honeyContract.allowance(
      window.ethereum.selectedAddress,
      beraFarm
    );

    const mintAmountCost = await this.getTransactionCostHoney();

    if (currentPlayerAllowance >= mintAmountCost) return 'Buy for $HONEY';

    return 'Approve Spend';
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
      const buyTx = this.beraFarmMethodCaller.buyBeraCubsForHoney(
        this.mintAmount
      );
      const confirmation = await buyTx.wait();
    } catch (err) {
      alert(`Buy For Honey Failed ${err}`);
    }
  }

  async buyBeraCubsForFuzz() {
    try {
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

    return await this.beraFarmMethodCaller.getHoneyBuyTransactionCost(
      currentTotalSupply,
      totalSupplyPlusAmount,
      this.mintAmount
    );
  }

  async getTransactionCostBond() {
    const bondCost = ethers.formatEther(this.beraFarmContract.getBondCost());

    return parseInt(bondCost) * this.mintAmount;
  }

  async getTransactionCostFuzz(): Promise<number> {
    return await this.beraFarmContract.maxCompoundCostSoFar();
  }
}
