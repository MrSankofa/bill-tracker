import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillsEntity } from '../+state/bills.models';
import { Store } from '@ngrx/store';
import * as BillsActions from '../+state/bills.actions'
import { Observable } from 'rxjs';
import { selectAllBills } from '../+state/bills.selectors';

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css',
})
export class TrackerComponent {
  title = 'bill-tracker';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  bills$: Observable<BillsEntity[]> = [];
  isModalOpen = false;
  selectedBillId: string | null = null;


  constructor(private store: Store) {
    this.store = store;
    this.bills$ = this.store.select(selectAllBills)
  }
  // Handle form submission for adding/updating a bill
  saveBill(event: Event): void {
    event.preventDefault();

    const id = (document.getElementById('bill-id') as HTMLInputElement).value || Math.random().toString(36).substring(2);
    const name = (document.getElementById('bill-name') as HTMLInputElement).value;
    const dueDate = parseInt((document.getElementById('due-date') as HTMLInputElement).value);
    const amount = parseFloat((document.getElementById('bill-amount') as HTMLInputElement).value);
    const source = (document.getElementById('source') as HTMLInputElement).value;
    const category = (document.getElementById('category') as HTMLInputElement).value;

    const bill: BillsEntity = { id, name, dueDate: dueDate, amount, bankAccount: source, category, isPaid: 0 };

    this.store.dispatch(BillsActions.addBillSuccess({ bill }));
  }

  // Handle CSV file upload
  uploadCSV(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result as string;
        const bills: BillsEntity[] = csvData
          .split('\n')
          .slice(1)
          .map((row) => {
            const [name, dueDate, amount, source, category] = row.split(',');
            return {
              id: Math.random().toString(36).substring(2),
              name,
              dueDate: new Date(dueDate).getTime(),
              amount: parseFloat(amount),
              bankAccount: source,
              category,
              isPaid: 0,
            };
          });

        // this.store.dispatch(BillsActions.uploadCSV({ bills }));
      };
      reader.readAsText(fileInput.files[0]);
    }
  }

  // Handle sorting bills
  sortBills(column: string): void {
    // this.store.dispatch(BillsActions.sortBills({ column, order: 'asc' })); // Example: Sorting in ascending order
  }

  openDeleteModal(id: string): void {
    this.isModalOpen = true;
    this.selectedBillId = id;
  }

  closeDeleteModal(): void {
    this.isModalOpen = false;
    this.selectedBillId = null;
  }

  confirmDelete(): void {
    if (this.selectedBillId) {
      this.store.dispatch(BillsActions.deleteBillSuccess({ id: this.selectedBillId }));
      this.closeDeleteModal();
    }
  }
}
