import AzureDAO, { AzureConnection } from "../dao/azure-dao"
import Reimbursement from "../entities/reimbursement";

describe("Reimbursement Azure DAO Test", () => {
    const testConnectionToAzure: AzureDAO = new AzureConnection;
    const reimbursementExample: Reimbursement = { 
        id: "",
        submittalTimeStamp: "",
        amount: 50000.00,
        comment: "Money, please!",
        status: "",
        receipts: ["IOU.pdf"]
    }

    it("Should CREATE & RETURN the same REIMBURSEMENT from Cosmos", async() => {
        const reimbursement = await testConnectionToAzure.createReimbursement(reimbursementExample);
        console.log(reimbursement);
        reimbursementExample.id = reimbursement.id;

        expect(reimbursement).not.toBeNull();
    })

    it("Should RETURN ALL REIMBURSEMENTS from Cosmos", async() => {
        const reimbursements = await testConnectionToAzure.getAllReimbursements();
        console.log(reimbursements);

        expect(reimbursements).not.toBeNull();
    })
})