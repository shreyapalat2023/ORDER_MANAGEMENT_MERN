import express from "express";
import { getItemUtilization } from "../controllers/item-utilization.js";

const router = express.Router();

router.get("/:itemId/utilization", getItemUtilization);
export default router