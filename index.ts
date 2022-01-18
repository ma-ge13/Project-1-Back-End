import express from "express";
import ReimbursementService, { ReimbursementServiceImpl } from "./services/reimbursement-service";
import cors from "cors";
import _ from "lodash";
import Employee from "./entities/employee";
import EmployeeService, { EmployeeServiceImpl } from "./services/employee-service";

const app = express();
const employeeService: EmployeeService = new EmployeeServiceImpl;
const reimburseService: ReimbursementService = new ReimbursementServiceImpl;

app.use(express.json());
app.use(cors());

app.get("/employee", async (req, res) => {
        
    try {
        const employee: Employee = await employeeService.getEmployeeRequest(
          String(req.query.username),
          String(req.query.password)
        );
        res.status(200).send(employee);
    } catch (error) {
        res.status(401).send("Invalid credentials.");
    }
});

app.post("/reimbursements", async (req, res) => {
    
    try {
        const newReimbursement = await reimburseService.generateReimbursementRequest(req.body);
        res.status(201).send(newReimbursement!);
    } catch (error) {
        res.status(400).send(error.message);
    };
});

app.get("/reimbursements", async (req, res) => {
    const reimbursements = await reimburseService.retrieveAllReimbursementsRequest();

    res.status(200).send(reimbursements);
});

app.get("/reimbursements/pending", async (req, res) => {
    const reimbursements = await reimburseService.retrievePendingReimbursementsRequest();

    res.status(200).send(reimbursements);
});

app.put("/reimbursements/update", async (req, res) => {
    await reimburseService.updateReimbursementRequest(req.body);

    res.status(200).send();
});

app.listen(4444, () => { console.log("Webserver is running . . .") });