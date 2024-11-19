import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BILLS_FEATURE_KEY, BillsState, billsAdapter } from './bills.reducer';

// Lookup the 'Bills' feature state managed by NgRx
export const selectBillsState =
  createFeatureSelector<BillsState>(BILLS_FEATURE_KEY);

const { selectAll, selectEntities } = billsAdapter.getSelectors();

export const selectBillsLoaded = createSelector(
  selectBillsState,
  (state: BillsState) => state.loaded
);

export const selectBillsError = createSelector(
  selectBillsState,
  (state: BillsState) => state.error
);

export const selectAllBills = createSelector(
  selectBillsState,
  (state: BillsState) => selectAll(state)
);

export const selectBillsEntities = createSelector(
  selectBillsState,
  (state: BillsState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectBillsState,
  (state: BillsState) => state.selectedId
);

export const selectEntity = createSelector(
  selectBillsEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
