import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as BillsActions from './bills.actions';

@Injectable()
export class BillsEffects {
  private actions$ = inject(Actions);

  // todo: update this init to fetch the bills from java spring boot
  /*
  *
  *
  *
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BillsActions.initBills),
      switchMap(() =>
        this.httpClient.get<Bill[]>('/api/bills').pipe(
          map((bills) => BillsActions.loadBillsSuccess({ bills })), // Dispatch success action with fetched bills
          catchError((error) => {
            console.error('Error', error);
            return of(BillsActions.loadBillsFailure({ error })); // Dispatch failure action on error
          })
        )
      )
    )
  );
  *
  * */
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BillsActions.initBills),
      switchMap(() => of(BillsActions.loadBillsSuccess({ bills: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(BillsActions.loadBillsFailure({ error }));
      })
    )
  );
}
