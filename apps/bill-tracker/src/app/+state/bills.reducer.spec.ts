import { Action } from '@ngrx/store';

import * as BillsActions from './bills.actions';
import { BillsEntity } from './bills.models';
import { BillsState, initialBillsState, billsReducer } from './bills.reducer';

describe('Bills Reducer', () => {
  const createBillsEntity = (id: string, name = ''): BillsEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Bills actions', () => {
    it('loadBillsSuccess should return the list of known Bills', () => {
      const bills = [
        createBillsEntity('PRODUCT-AAA'),
        createBillsEntity('PRODUCT-zzz'),
      ];
      const action = BillsActions.loadBillsSuccess({ bills });

      const result: BillsState = billsReducer(initialBillsState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = billsReducer(initialBillsState, action);

      expect(result).toBe(initialBillsState);
    });
  });
});
