import { createAction, props } from '@ngrx/store';

export const reinitializeContracts = createAction('[Contracts] Reinitialize');
export const networkChanged = createAction(
  '[Contracts] Network Changed',
  props<{ networkId: number }>()
);
export const reinitializeContractsSuccess = createAction(
  '[Contracts] Reinitialize Success',
  props<{
    beraFarmContract: any;
    fuzzTokenContract: any;
    honeyContract: any;
    beraCubContract: any;
  }>()
);
export const reinitializeContractsFailure = createAction(
  '[Contracts] Reinitialize Failure',
  props<{ error: any }>()
);
