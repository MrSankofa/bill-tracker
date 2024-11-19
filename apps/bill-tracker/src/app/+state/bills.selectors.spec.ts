import { BillsEntity } from './bills.models';
import {
  billsAdapter,
  BillsPartialState,
  initialBillsState,
} from './bills.reducer';
import * as BillsSelectors from './bills.selectors';

describe('Bills Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getBillsId = (it: BillsEntity) => it.id;
  const createBillsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as BillsEntity);

  let state: BillsPartialState;

  beforeEach(() => {
    state = {
      bills: billsAdapter.setAll(
        [
          createBillsEntity('PRODUCT-AAA'),
          createBillsEntity('PRODUCT-BBB'),
          createBillsEntity('PRODUCT-CCC'),
        ],
        {
          ...initialBillsState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Bills Selectors', () => {
    it('selectAllBills() should return the list of Bills', () => {
      const results = BillsSelectors.selectAllBills(state);
      const selId = getBillsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = BillsSelectors.selectEntity(state) as BillsEntity;
      const selId = getBillsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectBillsLoaded() should return the current "loaded" status', () => {
      const result = BillsSelectors.selectBillsLoaded(state);

      expect(result).toBe(true);
    });

    it('selectBillsError() should return the current "error" state', () => {
      const result = BillsSelectors.selectBillsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
