import Reimbursement from "../entities/reimbursement";
import { CosmosClient } from "@azure/cosmos";

const client = new CosmosClient(process.env.COSMOS_CONNECTION!);
const db = client.database("PayMyMoneyService DB");
const container = db.container("Employees");

export default interface AzureDAO {    
    createReimbursement(request: Reimbursement): Promise<Reimbursement>;

    getReimbursementById(reimbursementId: string): Promise<Reimbursement>;

    getAllReimbursements(): Promise<Reimbursement[]>;
}

export class AzureConnection implements AzureDAO {
    async createReimbursement(request: Reimbursement): Promise<Reimbursement> {
        await container.items.create(request);

        return this.getReimbursementById(request.id);
    }

    async getReimbursementById(reimbursementId: string): Promise<Reimbursement> {
        const response = await container.item(reimbursementId, reimbursementId).read<Reimbursement>();

        return (this.scrubAzureData(response.resource))[0];
    }

    async getAllReimbursements(): Promise<Reimbursement[]> {
        let response = await container.items.readAll<Reimbursement>().fetchAll();

        return this.scrubAzureData(response.resources);
    }

    private scrubAzureData(resources): Reimbursement[] {
        const records: Reimbursement[] = [];
        
        if (Array.isArray(resources))
            for (let record of resources)
                records.push((({id, submittalTimeStamp, amount, comment, status, receipts}) => 
                    ({id, submittalTimeStamp, amount, comment, status, receipts}))(record));
        else
            records.push((({id, submittalTimeStamp, amount, comment, status, receipts}) => 
                ({id, submittalTimeStamp, amount, comment, status, receipts}))(resources));
        
        return records;
    }
}