import express from "express";
import ReimbursementService, { ReimbursementServiceImpl } from "./services/reimbursement-service";
import cors from "cors";
import _ from "lodash";
import Employee from "./entities/employee";
import LoginService, { LoginServiceImpl } from "./services/login-service";
import Reimbursement from "./entities/reimbursement";

const app = express();
const employeeService: LoginService = new LoginServiceImpl;
const reimburseService: ReimbursementService = new ReimbursementServiceImpl;

app.use(express.json());
app.use(cors());
app.disable("x-powered-by");


// ROUTE TO READ EMPLOYEE:

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


// ROUTE TO CREATE REIMBURSEMENT:

app.post("/reimbursements", async (req, res) => {
    
    try {
        const newReimbursement: Reimbursement = await reimburseService.generateReimbursementRequest(req.body);
        res.status(201).send(newReimbursement!);
    } catch (error) {
        res.status(400).send(error.message);
    };
});


// ROUTES TO READ:

// All Reimbursements
app.get("/reimbursements", async (req, res) => {
    const reimbursements: Reimbursement[] = await reimburseService.retrieveAllReimbursementsRequest();

    res.status(200).send(reimbursements);
});

// All Pending Reimbursements
app.get("/reimbursements/pending", async (req, res) => {
    const reimbursements: Reimbursement[] = await reimburseService.retrievePendingReimbursementsRequest();

    res.status(200).send(reimbursements);
});

// A Single Reimbursement
app.get("/reimbursements/:id", async (req, res) => {
    const reimbursement: Reimbursement = await reimburseService.retrieveReimbursementByIdRequest(req.params.id);

    res.status(200).send(reimbursement);
});


// ROUTE TO UPDATE A REIMBURSEMENT

app.put("/reimbursements/update", async (req, res) => {
    await reimburseService.updateReimbursementRequest(req.body);

    res.status(200).send();
});

app.listen(4444, () => {
    console.log("Webserver is running . . .")
});