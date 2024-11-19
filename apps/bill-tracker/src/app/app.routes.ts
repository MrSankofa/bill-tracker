import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromBills from './+state/bills.reducer';
import { BillsEffects } from './+state/bills.effects';

// todo: future routes reroute '' => 'dashbaord, bills, and anything else ** to 404 Not Found
export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./tracker/tracker.component').then((m) => m.TrackerComponent),
    providers: [
      provideState(fromBills.BILLS_FEATURE_KEY, fromBills.billsReducer),
      provideEffects(BillsEffects),
    ],
  },
];
