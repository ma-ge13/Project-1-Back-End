import Reimbursement from "../entities/reimbursement";
import { CosmosClient } from "@azure/cosmos";
import _ from "lodash";

const client = new CosmosClient(process.env.COSMOS_CONNECTION!);
const db = client.database("PayMyMoneyService DB");
const container = db.container("Reimbursements");

export default interface ReimbursementDAO {
  createReimbursement(request: Reimbursement): Promise<Reimbursement>;

  getAllReimbursements(): Promise<Reimbursement[]>;

  getPendingReimbursements(): Promise<Reimbursement[]>;

  getReimbursementById(reimbursementId: string): Promise<Reimbursement>;

  updateReimbursement(reimbursement: Reimbursement);
}

export class AzureReimbursement implements ReimbursementDAO {
    async createReimbursement(request: Reimbursement): Promise<Reimbursement> {
        const response = await container.items.create(request);

        return this.getReimbursementById(response.resource!.id);
    }

    async getAllReimbursements(): Promise<Reimbursement[]> {
        let response = await container.items.readAll<Reimbursement>().fetchAll();

        return this.scrubAzureData(response.resources);
    }

    async getPendingReimbursements(): Promise<Reimbursement[]> {
        const reimbursements = this.getAllReimbursements();

        return (await reimbursements).filter(r => r.status === "Pending");
    }

    async getReimbursementById(reimbursementId: string): Promise<Reimbursement> {
        const query = container.items.query(`SELECT * FROM Reimbursements r WHERE r.id = "${reimbursementId}"`);
        const response = (await query.fetchAll()).resources[0];

        return (this.scrubAzureData(response))[0];
    }

    async updateReimbursement(reimbursement: Reimbursement) {
        await container.item(reimbursement.id!, reimbursement.id).replace<Reimbursement>(reimbursement);

        return
    }

    private scrubAzureData(reimbursementRecords): Reimbursement[] {
        const reimbursements: Reimbursement[] = [];
        let reimbursement;

        if (Array.isArray(reimbursementRecords))
            for (let record of reimbursementRecords) {
                ({...reimbursement} = _.omit((record), ["_rid", "_self", "_etag", "_attachments", "_ts"]));
                reimbursements.push(reimbursement);
            }
        else {
            ({...reimbursement} = _.omit((reimbursementRecords), ["_rid", "_self", "_etag", "_attachments", "_ts"]));
            reimbursements.push(reimbursement);
        }

        return reimbursements;
    }
}