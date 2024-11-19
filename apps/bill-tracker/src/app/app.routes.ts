import { Route } from '@angular/router';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromBills from './+state/bills.reducer';
import { BillsEffects } from './+state/bills.effects';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./app.component').then((m) => m.AppComponent),
    providers: [
      provideState(fromBills.BILLS_FEATURE_KEY, fromBills.billsReducer),
      provideEffects(BillsEffects),
    ],
  },
];
