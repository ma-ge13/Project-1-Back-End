export default interface Reimbursement {
    amount: number,
    description: string,
    receipts: Array<string>,
    id?: string,
    submittalTime?: number,
    status?: string,
    resolutionTime?: number
}