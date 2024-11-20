import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BILLS_FEATURE_KEY, BillsState, billsAdapter } from './bills.reducer';
import { BillsEntity } from './bills.models';

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

export const selectTotalAmountDue = createSelector(
  selectAllBills,
  (bills) =>
    bills.reduce((total, bill) => total + (bill.isPaid === 0 ? bill.amount : 0), 0)
);

export const selectUnpaidBills = createSelector(
  selectAllBills,
  (bills) => bills.filter((bill) => bill.isPaid === 0)
);

export const selectPaidBills = createSelector(
  selectAllBills,
  (bills) => bills.filter((bill) => bill.isPaid === 1)
);

export const selectBillsByDueDateRange = (startDate: number, endDate: number) =>
  createSelector(selectAllBills, (bills) =>
    bills.filter((bill) => bill.dueDate >= startDate && bill.dueDate <= endDate)
  );

export const selectBillsByBankAccount = (bankAccount: string) =>
  createSelector(selectAllBills, (bills) =>
    bills.filter((bill) => bill.bankAccount === bankAccount)
  );

export const selectBillById = (id: string) =>
  createSelector(selectAllBills, (bills) =>
    bills.find((bill) => bill.id === id)
  );

// Filter bills where teh due date is passed and is unpaid
export const selectOverdueBills = createSelector(
  selectAllBills,
  (bills) => {
    const now = new Date(Date.now()).getDate();
    return bills.filter((bill) => bill.dueDate < now && bill.isPaid === 0);
  }
);

// select count of paid and unpaid bills
export const selectBillsCount = createSelector(
  selectAllBills,
  (bills) => {
    const paid = bills.filter((bill) => bill.isPaid === 1).length;
    const unpaid = bills.filter((bill) => bill.isPaid === 0).length;
    return { paid, unpaid };
  }
);

// Calculate the total amount due grouped by bank account.
export const selectTotalAmountByBankAccount = createSelector(
  selectAllBills,
  (bills) => {
    return bills.reduce((acc, bill) => {
      if (!acc[bill.bankAccount]) {
        acc[bill.bankAccount] = 0;
      }
      acc[bill.bankAccount] += bill.amount;
      return acc;
    }, {} as Record<string, number>);
  }
);

// select next due bills
export const selectNextDueBill = createSelector(
  selectAllBills,
  (bills) => {
    const now = Date.now();
    return bills
      .filter((bill) => bill.dueDate >= now)
      .sort((a, b) => a.dueDate - b.dueDate)[0];
  }
);

export const selectBillsGroupedByDueDate = createSelector(
  selectAllBills,
  (bills) => {
    return bills.reduce((grouped, bill) => {
      const dueDate = new Date(bill.dueDate).toISOString().split('T')[0];
      if (!grouped[dueDate]) {
        grouped[dueDate] = [];
      }
      grouped[dueDate].push(bill);
      return grouped;
    }, {} as Record<string, BillsEntity[]>);
  }
);

export const selectBillsSummary = createSelector(
  selectAllBills,
  (bills) => {
    const totalBills = bills.length;
    const totalAmountDue = bills.reduce((total, bill) => total + (bill.isPaid === 0 ? bill.amount : 0), 0);
    const totalPaid = bills.reduce((total, bill) => total + (bill.isPaid === 1 ? bill.amount : 0), 0);
    return { totalBills, totalAmountDue, totalPaid };
  }
);

export const selectBillsByCategory = (category: string) =>
  createSelector(
    selectAllBills,
    (bills) => bills.filter((bill) => bill.category === category)
  );

export const selectUniqueCategoriesList = createSelector(
  selectAllBills,
  (bills) => [...new Set(bills.map((bill) => bill.category))]
);

export const selectTotalAmountByCategory = (category: string) =>
  createSelector(
    selectBillsByCategory(category),
    (bills) => bills.reduce((total, bill) => total + bill.amount, 0)
  );

export const selectBillsCountByCategory = createSelector(
  selectAllBills,
  (bills) => {
    return bills.reduce((counts, bill) => {
      counts[bill.category] = (counts[bill.category] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }
);

export const selectBillsGroupedByCategory = createSelector(
  selectAllBills,
  (bills) => {
    return bills.reduce((grouped, bill) => {
      if (!grouped[bill.category]) {
        grouped[bill.category] = [];
      }
      grouped[bill.category].push(bill);
      return grouped;
    }, {} as Record<string, BillsEntity[]>);
  }
);

export const selectCategoriesWithUnpaidBills = createSelector(
  selectAllBills,
  (bills) => {
    return [...new Set(bills.filter((bill) => bill.isPaid === 0).map((bill) => bill.category))];
  }
);

export const selectTotalUnpaidAmountByCategory = (category: string) =>
  createSelector(
    selectBillsByCategory(category),
    (bills) => bills.reduce((total, bill) => total + (bill.isPaid === 0 ? bill.amount : 0), 0)
  );

export const selectBillsByCategoryAndBankAccount = (category: string, bankAccount: string) =>
  createSelector(
    selectAllBills,
    (bills) =>
      bills.filter(
        (bill) => bill.category === category && bill.bankAccount === bankAccount
      )
  );

export const selectCategoryWithHighestTotal = createSelector(
  selectAllBills,
  (bills) => {
    const totals = bills.reduce((totals, bill) => {
      totals[bill.category] = (totals[bill.category] || 0) + bill.amount;
      return totals;
    }, {} as Record<string, number>);

    const maxAmount = Math.max(...Object.values(totals));
    return Object.keys(totals).filter((category) => totals[category] === maxAmount);
  }
);

export const selectBillsDueSoonByCategory = (category: string, days: number) =>
  createSelector(
    selectBillsByCategory(category),
    (bills) => {
      const now = new Date(Date.now()).getDate();
      const futureDate = now + days * 24 * 60 * 60 * 1000; // Convert days to milliseconds
      return bills.filter((bill) => bill.dueDate >= now && bill.dueDate <= futureDate);
    }
  );












