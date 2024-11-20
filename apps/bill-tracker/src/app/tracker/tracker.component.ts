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
  isModalCSVOpen = false;
  isModalOpen = false;
  selectedBillId: string | null = null;

  csvData: any[] = [];  // todo: marked for deletion

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
    const file = fileInput?.files?.[0];

    // Check if file exists
    if (!file) {
      this.store.dispatch(BillsActions.loadBillsFailure({ error: 'Unable to load file' }));
      alert('Please select a CSV file.');
      return;
    }

    const reader = new FileReader();

    // Handle FileReader errors
    reader.onerror = () => {
      alert('An error occurred while reading the file.');
    };

    // File read success
    reader.onload = (e) => {
      const csvData = e.target?.result as string;

      if (!csvData) {
        alert('The file appears to be empty.');
        return;
      }

      try {
        const rows = csvData.split('\n');
        const bills: BillsEntity[] = [];

        // Process each row (excluding the header)
        rows.slice(1).forEach((row, index) => {
          const [id, name, amount,dueDate, bankAccount, category, isPaid] = row.split(',').map(cell => cell.trim());

          // Validate row data
          if (!name || !dueDate || isNaN(Number(amount)) || !bankAccount || !category) {
            console.warn(`Skipping invalid row ${index + 2}: ${row}`);
            return;
          }

          bills.push({
            id: `${Date.now()}-${index}`, // Ensure unique ID
            name,
            dueDate: parseInt(dueDate),
            amount: parseFloat(amount),
            bankAccount,
            category,
            isPaid: 0, // Default to unpaid
          });
        });

        // Dispatch action to store the bills
        if (bills.length > 0) {
          this.store.dispatch(BillsActions.loadCSVSuccess({ bills: bills }));
          // alert('CSV file imported successfully.');
          // Simulate success
          this.isModalCSVOpen = true; // Open the success modal
        } else {
          this.store.dispatch(BillsActions.loadBillsFailure({ error: 'Unabled to load file' }));
          // alert('No valid rows found in the CSV file.');
        }
      } catch (error) {
        console.error('Error parsing CSV file:', error);
        alert('An error occurred while processing the CSV file.');
      }
    };

    // Read file as text
    reader.readAsText(file);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isModalCSVOpen = false;
  }


  // TODO: Handle sorting bills
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
