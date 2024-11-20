import { BillsEntity } from './bills.models';
import {
  selectAllBills,
  selectBillById,
  selectBillsByBankAccount,
  selectBillsByDueDateRange,
  selectBillsCount, selectBillsError,
  selectBillsGroupedByDueDate, selectBillsLoaded,
  selectBillsSummary, selectEntity,
  selectNextDueBill,
  selectOverdueBills,
  selectPaidBills,
  selectTotalAmountByBankAccount,
  selectTotalAmountDue, selectUniqueCategoriesList,
  selectUnpaidBills
} from './bills.selectors';
import { billsAdapter, BillsPartialState, BillsState, initialBillsState } from './bills.reducer';



describe('Bills Selectors', () => {
  let mockBills: BillsEntity[];

  const ERROR_MSG = 'No Error Available';

  let state: BillsPartialState;

  const getBillsId = (it: BillsEntity) => it.id;
  beforeEach(() => {
    mockBills = [
      {
        id: '1',
        name: 'Rent',
        amount: 1200,
        dueDate: new Date().setDate(new Date().getDate() + 3), // 3 days from now
        bankAccount: 'Bank A',
        category: 'Housing',
        isPaid: 0,
      },
      {
        id: '2',
        name: 'Electricity',
        amount: 200,
        dueDate: new Date().setDate(new Date().getDate() - 2), // 2 days ago
        bankAccount: 'Bank B',
        category: 'Utilities',
        isPaid: 1,
      },
      {
        id: '3',
        name: 'Internet',
        amount: 100,
        dueDate: new Date().setDate(new Date().getDate() + 5), // 5 days from now
        bankAccount: 'Bank A',
        category: 'Utilities',
        isPaid: 0,
      },
    ];


    state = {
      bills: billsAdapter.setAll(
        mockBills,
        {
          ...initialBillsState,
          selectedId: '1',
          error: ERROR_MSG,
          loaded: true,
          bills: mockBills
        }
      ),
    };
  });

  it('selectAllBills() should return the list of Bills', () => {

    const results = selectAllBills(state);
    const selId = getBillsId(results[1]);

    expect(results.length).toBe(3);
    expect(selId).toBe('2');
  });

  it('selectEntity() should return the selected Entity', () => {
    const result = selectEntity(state) as BillsEntity;
    const selId = getBillsId(result);

    expect(selId).toBe('1');
  });

  it('selectBillsLoaded() should return the current "loaded" status', () => {
    const result = selectBillsLoaded(state);

    expect(result).toBe(true);
  });

  it('selectBillsError() should return the current "error" state', () => {
    const result = selectBillsError(state);

    expect(result).toBe(ERROR_MSG);
  });



  // tests selectTotalAmountDue
  it('should calculate the total amount due for unpaid bills', () => {
    const result = callSelector(selectTotalAmountDue, state);
    expect(result).toBe(1300); // 1200 (Rent) + 100 (Internet)
  });

  it('should return only unpaid bills', () => {
    const result = callSelector(selectUnpaidBills, state);
    expect(result.length).toBe(2);
    expect(result.map((bill: { id: any; }) => bill.id)).toEqual(['1', '3']);
  });

  it('should return only paid bills', () => {
    const result = callSelector(selectPaidBills, state);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2'); // Electricity
  });

  it('should return bills due within a specific range', () => {
    const startDate = new Date().getTime();
    const endDate = new Date().setDate(new Date().getDate() + 4);

    const result = callSelector(selectBillsByDueDateRange(startDate, endDate), state);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1'); // Rent
  });

  it('should return bills associated with a specific bank account', () => {
    const result = callSelector(selectBillsByBankAccount('Bank A'), state);
    expect(result.length).toBe(2);
    expect(result.map((bill: { id: any; }) => bill.id)).toEqual(['1', '3']); // Rent and Internet
  });

  it('should return a bill by ID', () => {
    const result = callSelector(selectBillById('1'), state);
    expect(result).toEqual(mockBills[0]); // Rent
  });


  it('should return overdue unpaid bills', () => {
    const result = callSelector(selectOverdueBills, state);
    expect(result.length).toBe(0); // Only Electricity is overdue, but it is paid
  });


  it('should return the count of paid and unpaid bills', () => {
    const result = callSelector(selectBillsCount, state);
    expect(result).toEqual({ paid: 1, unpaid: 2 });
  });


  it('should calculate the total amount grouped by bank account', () => {
    const result = callSelector(selectTotalAmountByBankAccount, state);
    expect(result).toEqual({
      'Bank A': 1300, // Rent + Internet
      'Bank B': 200, // Electricity
    });
  });

  it('should return the next due bill', () => {
    const result = callSelector(selectNextDueBill, state);
    expect(result.id).toBe('1'); // Rent (next closest due date)
  });


  it('should group bills by their due dates', () => {
    const result = callSelector(selectBillsGroupedByDueDate, state);
    const dueDates = Object.keys(result);

    expect(dueDates.length).toBe(3); // 3 unique due dates
    expect(result[dueDates[0]].length).toBe(1); // Rent on the first due date
  });

  it('should summarize bills with total count, unpaid amount, and paid amount', () => {
    const result = callSelector(selectBillsSummary, state);
    expect(result).toEqual({
      totalBills: 3,
      totalAmountDue: 1300,
      totalPaid: 200,
    });
  });


  it('should return a list of unique categories', () => {
    const result = callSelector(selectUniqueCategoriesList, state);
    expect(result).toEqual(['Housing', 'Utilities']);
  });



});

  // Helper to call selectors
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const callSelector = (selector, state, ...args) => {
  return selector.projector(state.bills.bills, ...args); // yes this is funky I will have tor revisit
}

