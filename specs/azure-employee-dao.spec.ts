import EmployeeDAO, { AzureEmployeeConnection } from "../DAOs/azure-employees-dao"
import Employee from "../entities/employee";

describe("Azure Employee DAO Test", () => {
    
    it("Should RETURN EMPLOYEE from Cosmos", async () => {
        const testConnectionToAzure: EmployeeDAO = new AzureEmployeeConnection;
        const userCredentials: Employee = { username: "g.m@ponzibank.com", password: "sheckyshabazz!" };
        const response = await testConnectionToAzure.getEmployee(userCredentials);
        console.log(response);

        expect(response).not.toBeNull;
    })

    it("Should NOT RETURN EMPLOYEE from Cosmos", async () => {
        const testConnectionToAzure: EmployeeDAO = new AzureEmployeeConnection;
        const userCredentials: Employee = { username: "pay.me@ponzibank.com", password: "mymoney!" };
        const response = await testConnectionToAzure.getEmployee(userCredentials);
        console.log(response);

        expect(response).toBeNull;
    })
})