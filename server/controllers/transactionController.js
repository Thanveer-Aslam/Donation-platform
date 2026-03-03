import Donation from "../models/Donation.js";
import Transaction from "../models/Transaction.js";

// import razorpay from "../config/razorpay.js";
import crypto from "crypto";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// 🟢 DONOR → MAKE DONATION (NO AUTH)
// export const donateToCampaign = async (req, res) => {
//   try {
//     const {
//       campaignId,
//       amount,
//       donorName,
//       donorEmail,
//       donorPhone,
//       donorAddress,
//     } = req.body;

//     const donationAmount = Number(amount);

//     if (!campaignId || donationAmount <= 0) {
//       return res.status(400).json({
//         message: "Invalid donation data",
//       });
//     }

//     const campaign = await Donation.findById(campaignId);

//     if (!campaign || !campaign.isActive) {
//       return res.status(404).json({
//         message: "Campaign not available",
//       });
//     }

//     const transaction = await Transaction.create({
//       campaign: campaignId,
//       amount: donationAmount,
//       donorName: donorName || "Anonymous",
//       donorEmail,
//       donorPhone,
//       donorAddress,
//       paymentStatus: "pending",
//       paymentMethod: "razorpay",
//     });

//     // ✅ VERY IMPORTANT — update campaign amountRaised
//     campaign.amountRaised = Number(campaign.amountRaised || 0) + donationAmount;

//     // auto close campaign if reached target
//     if (campaign.amountRaised >= campaign.targetAmount) {
//       campaign.isActive = false;
//     }

//     await campaign.save();

//     res.status(200).json({
//       message: "Donation recorded successfully",
//       transaction,
//       campaign,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };


// 🔵 CREATOR → VIEW MY TRANSACTIONS
export const getMyTransactions = async (req, res) => {
  try {
    const creatorId = req.userId; // ✅ IMPORTANT

    const transactions = await Transaction.find()
      .populate({
        path: "campaign",
        match: { user: creatorId },
        select: "title targetAmount amountRaised",
      })
      .sort({ createdAt: -1 });

    const myTransactions = transactions.filter((t) => t.campaign);

    const totalRaised = myTransactions.reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      totalRaised,
      count: myTransactions.length,
      transactions: myTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 CREATOR → DASHBOARD STATS
export const getCreatorStats = async (req, res) => {
  try {
    const creatorId = req.userId;

    // Get transactions with campaign belonging to creator
    const transactions = await Transaction.find().populate({
      path: "campaign",
      match: { user: creatorId },
      select: "_id",
    });

    // Filter valid campaigns
    const creatorTransactions = transactions.filter((t) => t.campaign !== null);

    const totalRaised = creatorTransactions.reduce(
      (sum, t) => sum + t.amount,
      0,
    );

    const totalDonations = creatorTransactions.length;

    // Campaign stats still from Donation
    const campaigns = await Donation.find({ user: creatorId });

    const activeCampaigns = campaigns.filter((c) => c.isActive).length;
    const closedCampaigns = campaigns.length - activeCampaigns;

    res.json({
      totalRaised,
      totalDonations,
      activeCampaigns,
      closedCampaigns,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔵 CREATOR → RECENT TRANSACTIONS
export const getRecentTransactions = async (req, res) => {
  try {
    const creatorId = req.userId;

    // Get creator campaigns
    const campaigns = await Donation.find({ user: creatorId });
    const campaignIds = campaigns.map(c => c._id);

    // Get transactions for those campaigns
    const transactions = await Transaction.find({
      campaign: { $in: campaignIds },
    })
      .populate("campaign", "message")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 CREATOR → GET DONORS FOR SPECIFIC CAMPAIGN
export const getCampaignDonors = async (req, res) => {
  try {
    const { campaignId } = req.params;

    if (!campaignId) {
      return res.status(400).json({
        message: "Campaign ID required",
      });
    }

    const donors = await Transaction.find({
      campaign: campaignId,
    })
      .sort({ createdAt: -1 })
      .select("donorName amount paymentMethod createdAt");

    res.status(200).json(donors);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// export const createRazorpayOrder = async (req, res) => {
//   try {
//     const {
//       amount,
//       campaignId,
//       donorName,
//       donorEmail,
//       donorPhone,
//       donorAddress,
//     } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({
//         message: "Invalid amount",
//       });
//     }

//     // ✅ FIX: fetch campaign
//     const campaign = await Donation.findById(campaignId);

//     if (!campaign || !campaign.isActive) {
//       return res.status(404).json({
//         message: "Campaign not found or inactive",
//       });
//     }

//     const options = {
//       amount: Number(amount) * 100,
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//       notes: {
//         campaignId,
//         donorName,
//         donorEmail,
//         donorPhone,
//         donorAddress,
//       },
//     };

//     const order = await razorpay.orders.create(options);

//     res.json({
//       success: true,
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const verifyRazorpayPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       campaignId,
//       amount,
//       donorName,
//       donorEmail,
//       donorPhone,
//       donorAddress,
//     } = req.body;

//     // Step 1: Verify signature
//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({
//         message: "Payment verification failed",
//       });
//     }

//     // save transaction
//     const transaction = await Transaction.create({
//       campaign: campaignId,
//       amount: Number(amount),
//       donorName: donorName || "Anonymous",
//       donorEmail,
//       donorPhone,
//       donorAddress,
//       paymentMethod: "razorpay",
//       paymentStatus: "success",
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       razorpaySignature: razorpay_signature,
//     });

//     // update campaign
//     const campaign = await Donation.findById(campaignId);

//     if (!campaign) {
//       return res.status(404).json({
//         success: false,
//         message: "campaign not found",
//       })
//     }

//     campaign.amountRaised =
//       Number(campaign.amountRaised || 0) + Number(amount);

//     if (campaign.amountRaised >= campaign.targetAmount) {
//       campaign.isActive = false;
//     }

//     await campaign.save();

//     res.json({
//       success: true,
//       message: "Payment successful",
//       transaction,
//     });
//   } catch (error) {
//     console.error("Verify Payment Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

