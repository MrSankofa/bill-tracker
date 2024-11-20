import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { BILLS_FEATURE_KEY, billsReducer } from './+state/bills.reducer';
import { BillsEffects } from './+state/bills.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({[BILLS_FEATURE_KEY]: billsReducer}), // root-level reducers go here
    provideEffects([BillsEffects]), // root-level effects
    provideStoreDevtools({ maxAge: 25}),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
  ],
};
