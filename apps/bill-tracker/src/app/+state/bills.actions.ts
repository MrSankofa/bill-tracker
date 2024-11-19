import { createAction, props } from '@ngrx/store';
import { BillsEntity } from './bills.models';

export const initBills = createAction('[Bills Page] Init');

export const loadBillsSuccess = createAction(
  '[Bills/API] Load Bills Success',
  props<{ bills: BillsEntity[] }>()
);

export const loadBillsFailure = createAction(
  '[Bills/API] Load Bills Failure',
  props<{ error: any }>()
);
