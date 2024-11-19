/**
 * Interface for the 'Bills' data
 */
export interface BillsEntity {
  id: string; // Primary ID
  name: string;
  dueDate: number;
  amount: number;
  bankAccount: string;
  isPaid: number
}
