import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  connectRazorpay,
  getPaymentSettings,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

/* ===============================
   CREATOR ROUTES
================================= */

router.post("/connect", protect, connectRazorpay);
router.get("/settings", protect, getPaymentSettings);

/* ===============================
   DONOR ROUTES
================================= */

router.post("/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyRazorpayPayment);

export default router;
