import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import { from, map, catchError, of } from 'rxjs';
import {
  reinitializeContracts,
  reinitializeContractsSuccess,
  reinitializeContractsFailure,
} from './actions';
import { EthersService } from 'src/app/services/ethers-service/ethers-service.service';

@Injectable()
export class ContractEffects {
  constructor(
    private actions$: Actions,
    private ethersService: EthersService // Assuming you have a service for interacting with Ethereum
  ) {}

  reinitializeContracts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reinitializeContracts),
      switchMap(() =>
        from(this.ethersService.getProvider()).pipe(
          map((provider) => {
            const beraFarmContract =
              this.ethersService.getBeraFarmContract(provider);
            const beraCubContract =
              this.ethersService.getBeraCubContract(provider);
            const honeyContract = this.ethersService.getHoneyContract(provider);
            const fuzzTokenContract =
              this.ethersService.getTokenContract(provider);
            return reinitializeContractsSuccess({
              beraFarmContract,
              fuzzTokenContract,
              honeyContract,
              beraCubContract,
            });
          }),
          catchError((error) => of(reinitializeContractsFailure({ error })))
        )
      )
    )
  );
}
