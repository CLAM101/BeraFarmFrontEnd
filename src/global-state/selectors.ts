import { createSelector, createFeatureSelector } from '@ngrx/store';
import { FuzzFarmState } from './reducers';

export const fuzzFarmState = createFeatureSelector<FuzzFarmState>('fuzzFarmState');

export const selectAllContracts = createSelector(fuzzFarmState, (state: FuzzFarmState) => ({
  beraFarmContract: state.beraFarmContract,
  beraCubContract: state.beraCubContract,
  honeyContract: state.honeyContract,
  fuzzTokenContract: state.fuzzTokenContract,
  nftMarketContract: state.nftMarketContract,
}));
