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

export const addBillSuccess = createAction('[Bills] Add Bill Success', props<{ bill: BillsEntity }>());
export const addBillFailure = createAction('[Bills] Add Bill Failure', props<{ error: string }>());

export const updateBillSuccess = createAction('[Bills] Update Bill Success', props<{ bill: BillsEntity }>());
export const updateBillFailure = createAction('[Bills] Update Bill Failure', props<{ error: string }>());


export const deleteBillSuccess = createAction('[Bills] Delete Bill Success', props<{ id: string }>());
export const deleteBillFailure = createAction('[Bills] Delete Bill Failure', props<{ error: string }>());