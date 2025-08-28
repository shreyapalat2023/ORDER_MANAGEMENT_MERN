import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/auth.js"
import { addCustomer, list, update,remove } from "../controllers/customer.js";
const router = express.Router();

router.post("/customer", addCustomer);
router.get("/customers", requireSignIn, isAdmin, list);
router.put("/customers/:customerId", update);
router.delete("/customers/:customerId",remove);

export default router;