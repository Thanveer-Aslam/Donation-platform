import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createDonation,
  getMyDonations,
  getAllDonations,
  deleteDonation,
  updateDonation,
  donateToCampaign,
} from "../controllers/donationController.js";

import { upload } from "../middleware/upload.js";

const router = express.Router();

// Donate
// router.post("/donate", donateToCampaign);

// Create Campaign (with image upload)
router.post("/", protect, upload.single("image"), createDonation);

// Get creator campaigns
router.get("/my", protect, getMyDonations);

// Get all campaigns
router.get("/", getAllDonations);

// Delete campaign
router.delete("/:id", protect, deleteDonation);

// Update campaign (with image upload)
router.put("/:id", protect, upload.single("image"), updateDonation);

export default router;
