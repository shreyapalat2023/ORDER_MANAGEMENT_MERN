import express from "express";
import { getProfitLoss } from "../controllers/profit-loss.js";

const router = express.Router();

router.get("/profitloss",getProfitLoss)

export default router

