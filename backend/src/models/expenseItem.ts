export interface ExpenseItem {
   userId: string
   expenseId: string
   createdAt: string
   name: string
   date: string
   amount: number
   attachmentUrl?: string
 }