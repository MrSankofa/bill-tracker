import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action, ActionReducer } from '@ngrx/store';

import * as BillsActions from './bills.actions';
import { BillsEntity } from './bills.models';

export const BILLS_FEATURE_KEY = 'bills';

export interface BillsState extends EntityState<BillsEntity> {
  ids: string[]
  bills: BillsEntity[];
  selectedId?: string | number; // which Bills record has been selected
  loaded: boolean; // has the Bills list been loaded
  error?: string | null; // last known error (if any)
}

export interface BillsPartialState {
  readonly [BILLS_FEATURE_KEY]: BillsState;
}

export const billsAdapter: EntityAdapter<BillsEntity> = createEntityAdapter<BillsEntity>();

export const initialBillsState: BillsState = billsAdapter.getInitialState({
  // set initial required properties
  ids: [],
  bills: [],
  loaded: false,
});

const reducer: ActionReducer<BillsState, Action<string>> = createReducer(
  initialBillsState,
  on(BillsActions.initBills, (state) => {
      const updatedState = {
        ...state,
        loaded: false,
        error: null
      }

      return updatedState;
    }
  ),
  on(BillsActions.loadBillsSuccess, (state: BillsState, { bills }) => {
      const updatedState = { ...state, bills, loaded: true }

      const result =  billsAdapter.setAll(bills, updatedState);

      return result
    }
  ),
  on(BillsActions.loadBillsFailure, (state, { error }) => {
    const bills: BillsEntity[] = []
    return ({ ...state, bills, error });
  }),
  on(BillsActions.addBillSuccess, ( billsState, {bill} ) => {
    const updatedList = [...billsState.bills, bill];
    return {
      ...billsAdapter.setAll(updatedList, billsState),
      bills: updatedList
    }
  }),

  on(BillsActions.addBillFailure, ( billsState, {error} ) => {
    console.error(`Error: trouble adding bill. Keeping original state - ${error}`)
    return billsState;
  }),

  on(BillsActions.updateBillSuccess, (billsState, { bill} ) => {
    const updatedList = billsState.bills.map(b => (b.id === bill.id ? bill : b));
    return {
      ...billsAdapter.setAll(updatedList, billsState),
      bills: updatedList, // Explicitly update the `bills` array
    };
  }),

  on(BillsActions.updateBillFailure, ( billsState, {error} ) => {
    console.error(`Error: trouble updating bill. Keeping original state. - ${error}`)
    return billsState;
  }),

  on(BillsActions.deleteBillSuccess, (billsState: BillsState, {id} ) => {

    const updatedList = billsState.bills.filter( b => b.id !== id );
    return {
      ...billsAdapter.setAll(billsState.bills.filter(b => b.id !== id), billsState),
      bills: updatedList
    }
  }),
  on(BillsActions.deleteBillFailure, (billsState: BillsState, {error} ) => {
    console.error(`Error: trouble deleting bill. Keeping original state. - ${error}`)
    return billsState;
  })
);

export function billsReducer(state: BillsState | undefined, action: Action) {
  return reducer(state, action);
}
