/**
 * Interface for the 'Bills' data
 */
export interface BillsEntity {
  id: string | number; // Primary ID
  name: string;
  dueDate: string;
  amount: number;
  bankAccount: string;
  isPaid: number
}
