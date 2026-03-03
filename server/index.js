// import dotenv from "dotenv";
import "./config/env.js";;
// dotenv.config();  // ✅ MUST BE FIRST

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js"; // ✅ ADD THIS

import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// dotenv.config();

// ✅ CONNECT DATABASE
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server Running on http://localhost:${process.env.PORT}`);
});
