import { createReducer, on, Action } from '@ngrx/store';
import { reinitializeContractsSuccess } from './actions';

export interface FuzzFarmState {
  beraFarmContract: any;
  fuzzTokenContract: any;
  beraCubContract: any;
  honeyContract: any;
}

export const initialState: FuzzFarmState = {
  beraFarmContract: null,
  fuzzTokenContract: null,
  beraCubContract: null,
  honeyContract: null,
};

const reducer = createReducer(
  initialState,
  on(
    reinitializeContractsSuccess,
    (
      state,
      { beraFarmContract, fuzzTokenContract, honeyContract, beraCubContract }
    ) => ({
      ...state,
      beraFarmContract,
      fuzzTokenContract,
      honeyContract,
      beraCubContract,
    })
  )
);

export function reducers(
  fuzzFarmState: FuzzFarmState | undefined,
  action: Action
) {
  return reducer(fuzzFarmState, action);
}
