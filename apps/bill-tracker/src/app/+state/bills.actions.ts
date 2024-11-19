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

export const addBill = createAction('[Bills] Add Bill', props<{ bill: BillsEntity }>());
export const updateBill = createAction('[Bills] Update Bill', props<{ bill: BillsEntity }>());
export const deleteBill = createAction('[Bills] Delete Bill', props<{ id: number }>());