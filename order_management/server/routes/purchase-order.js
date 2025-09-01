import express from "express";
import { create, list, update, remove, getItem, updateItem ,removeItem} from "../controllers/purchase-order.js";

const router = express.Router();

router.post("/purchase-order", create);
router.get("/purchase-orders", list);
router.put("/purchase-order/:Id", update);
router.delete("/purchase-order/:Id", remove);
router.get("/purchase-order/:Id/items/:itemId", getItem);
router.put("/purchase-order/:Id/items/:itemId", updateItem);
router.delete("/purchase-order/:Id/items/:itemId", removeItem);

export default router