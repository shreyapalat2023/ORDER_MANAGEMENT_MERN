import express from "express";
import {getProfitLoss} from "../controllers/dashboard.js"
const router = express.Router();

router.post("/dashboard/profitloss", getProfitLoss);

export default router