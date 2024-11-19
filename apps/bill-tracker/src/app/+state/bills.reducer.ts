import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as BillsActions from './bills.actions';
import { BillsEntity } from './bills.models';

export const BILLS_FEATURE_KEY = 'bills';

export interface BillsState extends EntityState<BillsEntity> {
  selectedId?: string | number; // which Bills record has been selected
  loaded: boolean; // has the Bills list been loaded
  error?: string | null; // last known error (if any)
}

export interface BillsPartialState {
  readonly [BILLS_FEATURE_KEY]: BillsState;
}

export const billsAdapter: EntityAdapter<BillsEntity> =
  createEntityAdapter<BillsEntity>();

export const initialBillsState: BillsState = billsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialBillsState,
  on(BillsActions.initBills, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(BillsActions.loadBillsSuccess, (state, { bills }) =>
    billsAdapter.setAll(bills, { ...state, loaded: true })
  ),
  on(BillsActions.loadBillsFailure, (state, { error }) => ({ ...state, error }))
);

export function billsReducer(state: BillsState | undefined, action: Action) {
  return reducer(state, action);
}
