import express from "express";
import { addStock, listStock, updateStock, removeStock } from "../controllers/item-stock.js";

const router = express.Router();

router.post("/items/:itemId/stock", addStock);
router.get("/items/:itemId/stock", listStock);
router.put("/items/:itemId/stock/:stockId", updateStock);
router.delete("/items/:itemId/stock/:stockId", removeStock);

export default router;
