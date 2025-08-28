import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.js"
import { create, list, update, remove } from "../controllers/item-master.js"

const router = express.Router();

router.post("/item", create);
router.get("/items", list);
router.put("/items/:itemId", update);
router.delete("/items/:itemId", remove);

export default router