/**
 * Fields in a request to update a single EXPENSE item.
 */
export interface CreateExpenseRequest {
   name: string,
   date: string,
   amount: number
 }