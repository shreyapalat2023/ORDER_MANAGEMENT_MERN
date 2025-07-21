import express from "express";

const router = express.Router();


import { register, login, forgotPassword, verifyOtp, resendOtp, resetPasswordWithOtp } from "../controllers/auth.js";
import { requireSignIn, isAdmin } from "../middlewares/auth.js"



router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post('/resend-otp', resendOtp);

router.post("/reset-password", resetPasswordWithOtp);
router.get("/auth-check", requireSignIn, (req, res) => {
    res.json({ ok: true });
});
router.get("/admin-check", requireSignIn, isAdmin, (req, res) => {
    res.json({ ok: true });
})

export default router