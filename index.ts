import express from "express";
import Reimbursement from "./entities/reimbursement";
import ReimbursementService, { ReimbursementServiceImpl } from "./services/reimbursement-service";

const app = express();
const reimburseService: ReimbursementService = new ReimbursementServiceImpl;

app.use(express.json());

app.post("/reimbursements", async (req, res) => {
    let newReimbursement: Reimbursement;
    try {
        newReimbursement = await reimburseService.generateReimbursementRequest(req.body);
    } catch (error) {
        res.status(400).send(error.message);
    }

    res.status(201).send(newReimbursement!);
})

app.get("/reimbursements", async (req, res) => {
    const reimbursements = await reimburseService.retrieveAllReimbursementsRequest();

    res.status(200).send(reimbursements);
})

app.listen(4444, () => {console.log("Webserver is running . . .")})