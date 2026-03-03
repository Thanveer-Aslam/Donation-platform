import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  // donateToCampaign,
  getMyTransactions,
  getCreatorStats,
  getRecentTransactions,
  getCampaignDonors,
  // createRazorpayOrder,
  // verifyRazorpayPayment,
} from "../controllers/transactionController.js";

const router = express.Router();

// 🟢 Donor
// router.post("/donate", donateToCampaign);

// 🔵 Creator
router.get("/my", protect, getMyTransactions);

//creator stats
router.get("/stats", protect, getCreatorStats);

//recent transaction
router.get("/recent", protect, getRecentTransactions);

// 🔵 GET donors for specific campaign
router.get("/campaign/:campaignId", protect, getCampaignDonors);

// router.post("/create-order", createRazorpayOrder);

// router.post("/verify-payment", verifyRazorpayPayment);

export default router;
