import ReimbursementDAO, { AzureReimbursement } from "../DAOs/azure-reimbursement-dao"
import Reimbursement from "../entities/reimbursement";

describe("Reimbursement Azure DAO Test", () => {
    const testConnectionToAzure: ReimbursementDAO = new AzureReimbursement;
    const reimbursementExample: Reimbursement = {
      employeeId: "10f66ffe-ae5c-423e-8e8b-2881800b9236",
      amount: 50000.0,
      description: "Money, please!",
      receipts: ["IOU.pdf"],
    };

    it("Should CREATE & RETURN the same REIMBURSEMENT from Cosmos", async () => {
        const reimbursement = await testConnectionToAzure.createReimbursement(reimbursementExample);
        console.log(reimbursement);
        reimbursementExample.id = reimbursement.id;

        expect(reimbursement).not.toBeNull();
    });

    it("Should RETURN ALL REIMBURSEMENTS from Cosmos", async () => {
        const reimbursements = await testConnectionToAzure.getAllReimbursements();
        console.log(reimbursements);

        expect(reimbursements).not.toBeNull();
    });

    it("Should RETURN PENDING REIMBURSEMENTS from Cosmos", async () => {
        const reimbursements = await testConnectionToAzure.getPendingReimbursements();
        console.log(reimbursements);
        const statusList: string[] = [];
        for (const reimbursement of reimbursements) {
            statusList.push(reimbursement.status!)
        };
        console.log(statusList);

        expect(statusList).not.toContain("Approved" || "Denied");
        
    });

    it("Should RETURN SINGLE REIMBURSEMENT from Cosmos", async () => {
        const reimbursement = await testConnectionToAzure.getReimbursementById(reimbursementExample.id!);
        console.log(reimbursement);

        expect(reimbursement).not.toBeNull();
    });
})