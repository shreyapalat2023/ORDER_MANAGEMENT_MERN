import express from "express";
import { create, list, update,remove,getCustomerPOItems } from "../controllers/customerPO.js"

const router = express.Router();

router.post("/customer-po", create);
router.get("/customer-pos", list);
router.put("/customer-pos/:id",update)
router.delete("/customer-pos/:id", remove);
router.get("/customer-pos/:id/items", getCustomerPOItems);

export default router