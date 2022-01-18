import { CosmosClient } from "@azure/cosmos";
import Employee from "../entities/employee";
import _ from "lodash";

const client = new CosmosClient(process.env.COSMOS_CONNECTION!);
const db = client.database("PayMyMoneyService DB");
const container = db.container("Employees");

export default interface EmployeeDAO {
  getEmployee(username: string, password: string): Promise<Employee>;
}

export class AzureEmployeeConnection implements EmployeeDAO {
    
    async getEmployee(username: string, password: string): Promise<Employee> {
        const query = container.items.query(
            `SELECT * FROM Employees e WHERE e.username = "${username}"
                AND e.password = "${password}"`
        );
        const response = (await query.fetchAll()).resources[0];
        
        return this.scrubAzureData(response);
    }

    private scrubAzureData(employeeRecord: Employee): Employee {
        let employee;

        ({ ...employee } = _.omit(employeeRecord, ["id", "_rid", "_self", "_etag", "_attachments", "_ts"]));
        
        return employee;
    }
}