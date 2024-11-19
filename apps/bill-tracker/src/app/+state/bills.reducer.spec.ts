import { Action } from '@ngrx/store';

import * as BillsActions from './bills.actions';
import { BillsEntity } from './bills.models';
import { BillsState, initialBillsState, billsReducer } from './bills.reducer';

describe('Bills Reducer', () => {
  const createBillsEntity = (id: string, name = ''): BillsEntity => ({
    id,
    name: name || `name-${id}`,
    dueDate: 1,
    amount: 0,
    bankAccount: '',
    isPaid: 0
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

    it('should return an empty list of bills with loadBillsFailure', () => {

      const action = BillsActions.loadBillsFailure({ error: 'missing data' })

      const result = billsReducer(initialBillsState, action);

      expect(result.loaded).toBe(false)
      expect(result.ids.length).toBe(0)
    });

    it('should add a bill to the state and not overwrite data', () => {

      const initialBill: BillsEntity = {
        id: '1',
        name: 'Rent',
        dueDate: 1, // example timestamp
        amount: 1200,
        bankAccount: 'Bank A',
        isPaid: 1,
      };
      const initialState: BillsState = {
        ...initialBillsState,
        ids: [initialBill.id],
        entities: { [initialBill.id]: initialBill },
        bills: [initialBill],
        loaded: true,
      };

      const newBill: BillsEntity = {
        id: '2',
        name: 'Electricity',
        dueDate: 23, // example timestamp
        amount: 150,
        bankAccount: 'Bank B',
        isPaid: 0,
      };

      const action = BillsActions.addBillSuccess({bill: newBill});

      const updatedState = billsReducer(initialState, action);

      expect(updatedState.loaded).toBe(true);
      expect(updatedState.ids.length).toBe(2);
      expect(updatedState.ids).toContain('1')
      expect(updatedState.ids).toContain('2')

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
