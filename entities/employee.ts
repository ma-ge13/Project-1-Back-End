import Reimbursement from "./reimbursement";

export default interface Employee {
    id: string,
    firstName: string,
    lastName: string,
    department: string,
    team: number,
    isManager: boolean,
    reimbursements?: Reimbursement[]
}