import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";
import Donation from "../models/Donation.js";
import Transaction from "../models/Transaction.js";

/* =====================================================
   🔗 CONNECT RAZORPAY (CREATOR)
===================================================== */

export const connectRazorpay = async (req, res) => {
  try {
    const { keyId, keySecret } = req.body;

    if (!keyId || !keySecret) {
      return res.status(400).json({
        message: "Both Key ID and Key Secret are required",
      });
    }

    const user = await User.findById(req.userId);

    user.razorpay = {
      keyId,
      keySecret,
      isConnected: true,
    };

    await user.save();

    res.json({
      success: true,
      message: "Razorpay connected successfully",
    });
  } catch (error) {
    console.error("Connect Razorpay Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   📥 GET PAYMENT SETTINGS (CREATOR)
===================================================== */
export const getPaymentSettings = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    res.json({
      keyId: user?.razorpay?.keyId || "",
      isConnected: user?.razorpay?.isConnected || false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =====================================================
   💳 CREATE RAZORPAY ORDER (DONOR)
===================================================== */
export const createRazorpayOrder = async (req, res) => {
  try {
    const {
      amount,
      campaignId,
      donorName,
      donorEmail,
      donorPhone,
      donorAddress,
    } = req.body;


    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    // ✅ Fetch campaign
    const campaign = await Donation.findById(campaignId);

    if (!campaign || !campaign.isActive) {
      return res.status(404).json({
        message: "Campaign not found or inactive",
      });
    }

    // ✅ Fetch creator
    const creator = await User.findById(campaign.user);

    console.log("Creator Key:", creator.razorpay.keyId);
    console.log("Creator Secret:", creator.razorpay.keySecret);

    if (!creator?.razorpay?.isConnected) {
      return res.status(400).json({
        message: "Creator has not connected Razorpay",
      });
    }

    // 🔥 Create Razorpay instance dynamically
    const razorpay = new Razorpay({
      key_id: creator.razorpay.keyId,
      key_secret: creator.razorpay.keySecret,
    });

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        campaignId,
        donorName,
        donorEmail,
        donorPhone,
        donorAddress,
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: creator.razorpay.keyId, // 👈 frontend needs only key_id
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ VERIFY RAZORPAY PAYMENT
===================================================== */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      campaignId,
      amount,
      donorName,
      donorEmail,
      donorPhone,
      donorAddress,
    } = req.body;

    // ✅ Get campaign
    const campaign = await Donation.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    // ✅ Get creator
    const creator = await User.findById(campaign.user);

    if (!creator?.razorpay?.isConnected) {
      return res.status(400).json({
        message: "Creator payment not configured",
      });
    }

    // 🔥 Verify signature using creator secret
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", creator.razorpay.keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    // 🚫 Prevent duplicate entry
    const existing = await Transaction.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (existing) {
      return res.json({
        success: true,
        message: "Payment already recorded",
      });
    }

    // ✅ Save transaction
    const transaction = await Transaction.create({
      campaign: campaignId,
      amount: Number(amount),
      donorName: donorName || "Anonymous",
      donorEmail,
      donorPhone,
      donorAddress,
      paymentMethod: "razorpay",
      paymentStatus: "success",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    // ✅ Update campaign amount
    campaign.amountRaised =
      Number(campaign.amountRaised || 0) + Number(amount);

    if (campaign.amountRaised >= campaign.targetAmount) {
      campaign.isActive = false;
    }

    await campaign.save();

    res.json({
      success: true,
      message: "Payment successful",
      transaction,
    });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};