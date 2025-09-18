import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
//routes
import authRoutes from "./routes/auth.js";
import customerRoutes from "./routes/customer.js"
import supplierRoutes from "./routes/supplier.js"
import itemmasterRoutes from "./routes/item-master.js";
import stockRoutes from "./routes/item-stock.js"
import customerPORoutes from "./routes/customerPO.js";
import purchaseOrderRoutes from "./routes/purchase-order.js";
import profitLossRoutes  from "./routes/profit-loss.js";
import itemUtilizationRoute from "./routes/item-utilization.js";
import dashboardRtoues from "./routes/dashboard.js";

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
app.use("/api",customerRoutes); 
app.use("/api",supplierRoutes);
app.use("/api",itemmasterRoutes);
app.use("/api",stockRoutes);
app.use("/api",customerPORoutes);
app.use("/api",purchaseOrderRoutes);
app.use("/api",itemUtilizationRoute);
app.use("/api",profitLossRoutes);
app.use("/api",dashboardRtoues)

//connecting to server
let port = process.env.PORT || 7000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

})

// .env