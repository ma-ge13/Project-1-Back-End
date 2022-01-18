import _ from "lodash";
import EmployeeDAO, { AzureEmployeeConnection } from "../DAOs/azure-employees-dao";
import Employee from "../entities/employee";

const connectToDAO: EmployeeDAO = new AzureEmployeeConnection;

export default interface EmployeeService {
    
    getEmployeeRequest(username: string, password: string): Promise<Employee>;
}

export class EmployeeServiceImpl implements EmployeeService {

    async getEmployeeRequest(username: string, password: string): Promise<Employee> {
        if (!username || !password) {
            throw new Error;
        }
        
        const employee = await connectToDAO.getEmployee(username, password);

        if (_.isEmpty(employee)) {
            throw new Error;
        }
        
        return employee;
    }
}