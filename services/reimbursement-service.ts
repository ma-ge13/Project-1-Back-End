import Reimbursement from "../entities/reimbursement";
import ReimbursementDAO, { AzureReimbursement } from "../DAOs/azure-reimbursement-dao";
import { v4 } from "uuid";
import _ from "lodash";

const connectToDAO: ReimbursementDAO = new AzureReimbursement;

export default interface ReimbursementService {
  generateReimbursementRequest(received: Reimbursement): Promise<Reimbursement>;

  retrieveAllReimbursementsRequest(): Promise<Reimbursement[]>;

  retrievePendingReimbursementsRequest(): Promise<Reimbursement[]>;

  retrieveReimbursementByIdRequest(reimbursementId: string): Promise<Reimbursement>;

  updateReimbursementRequest(received: Reimbursement);
}

export class ReimbursementServiceImpl implements ReimbursementService {
    
    generateReimbursementRequest(received: Reimbursement): Promise<Reimbursement> {
        try {
            this.validateReimbursement(received);
        } catch (error) {
            throw new Error(`The ${error.message} section of your request is empty or contains invalid data.`);
        }

        return connectToDAO.createReimbursement(received);
    }

    retrieveAllReimbursementsRequest(): Promise<Reimbursement[]> {
        
        return connectToDAO.getAllReimbursements();
    }

    retrievePendingReimbursementsRequest(): Promise<Reimbursement[]> {
        
        return connectToDAO.getPendingReimbursements();
    }

    retrieveReimbursementByIdRequest(reimbursementId: string): Promise<Reimbursement> {

        return connectToDAO.getReimbursementById(reimbursementId);
    }

    async updateReimbursementRequest(received: Reimbursement) {
        this.validateReimbursement(received);
        
        await connectToDAO.updateReimbursement(received);
    }

    private validateReimbursement(received: Reimbursement): Reimbursement {
        try {
            this.verifyReimbursement(received);
        } catch (error) {
            throw error;
        }
        
        if(!received.id) {
            received.id = v4();
            received.submittalTime = new Date().getTime();
            received.status = "Pending";
        }
        else
            received.resolutionTime = new Date().getTime();

        return received;
    }

    private verifyReimbursement (received: Reimbursement): Reimbursement {
        const requiredProperties = ["description", "receipts", "amount"];
        for (const property of requiredProperties) {
            if ((!received[property] || property === "receipts" && _.isEmpty(received.receipts)) || property === "amount" && received.amount < 0) {
                throw new Error(`${property}`);
            }
        }

        return received;
    }

}