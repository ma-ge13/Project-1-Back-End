import Reimbursement from "../entities/reimbursement";
import AzureDAO, { AzureConnection } from "../dao/azure-dao";
import { v4 } from "uuid";

const connectToAzure: AzureDAO = new AzureConnection;
const today = new Date();

export default interface ReimbursementService {
    
    generateReimbursementRequest(request: Reimbursement): Promise<Reimbursement>;

    retrieveAllReimbursementsRequest(): Promise<Reimbursement[]>;
}

export class ReimbursementServiceImpl implements ReimbursementService {
    
    async generateReimbursementRequest(received: Reimbursement): Promise<Reimbursement> {
        try {
            this.validateReimbursement(received);
        } catch (error) {
            throw new Error(`Your request is missing the "${error.message}:" property within its body.`);
        }

        return await connectToAzure.createReimbursement(received);
    }

    async retrieveAllReimbursementsRequest(): Promise<Reimbursement[]> {
        
        return await connectToAzure.getAllReimbursements();
    }

    private validateReimbursement(received: Reimbursement): Reimbursement {
        try {
            this.verifyReimbursement(received);
        } catch (error) {
            throw error;
        }

        received.id = v4();
        received.submittalTimeStamp = `${today.getTime()}`;
        received.status = "Pending";

        return received;
    }

    private verifyReimbursement (received: Reimbursement): Reimbursement {
        const requiredProperties = ["amount", "comment", "receipts"];
        for (const property of requiredProperties) {
            if (!received.hasOwnProperty(property))
                throw new Error(`${property}`);
        }

        return received;
    }

}