import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as BillsActions from './bills.actions';
import * as BillsFeature from './bills.reducer';

@Injectable()
export class BillsEffects {
  private actions$ = inject(Actions);

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
