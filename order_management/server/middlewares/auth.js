import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

export const requireSignIn = async (req, res, next) => {
    try {
        const decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        console.log("DECODED =>", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized, invalid token" });
    }
};


export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.role !== 1) {
            return res.status(403).send("Access Denied");
        }
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};
