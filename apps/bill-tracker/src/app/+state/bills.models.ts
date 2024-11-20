/**
 * Interface for the 'Bills' data
 */
export interface BillsEntity {
  id: string; // Primary ID
  name: string;
  amount: number;
  dueDate: number;
  bankAccount: string;
  category: string;
  isPaid: number;
}
