import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/auth.js"
import { create, list, update, remove } from "../controllers/supplier.js"

const router = express.Router();
router.post("/supplier", requireSignIn, isAdmin, create);
router.get("/suppliers", requireSignIn, isAdmin, list);
router.put("/suppliers/:supplierId", requireSignIn, isAdmin, update)
router.delete("/suppliers/:supplierId", requireSignIn, isAdmin, remove);

export default router

