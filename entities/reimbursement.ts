export default interface Reimbursement {
  employeeId: string;
  lastName?: string;
  firstName?: string;
  amount: number;
  description: string;
  receipts: Array<string>;
  id?: string;
  submittalTime?: number;
  status?: string;
  comment?: string;
  resolutionTime?: number;
}