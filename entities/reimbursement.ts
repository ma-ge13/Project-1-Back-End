export default interface Reimbursement {
    id: string,
    submittalTimeStamp: string,
    amount: number,
    comment: string,
    status: string,
    resolutionTimeStamp?: string,
    receipts: [{}]
}