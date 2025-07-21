import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.json());

// connect to mongodb 
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Db connected"))
    .catch((err) => console.log("DB error", err)
    )
//middlewares
app.use(cors());
app.use(morgan("dev"));
//routes
app.use("/api", authRoutes);

//connecting to server
let port = process.env.PORT || 7000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

})

// .env