import Donation from "../models/Donation.js"

export const createDonation = async (req, res) => {
    try {
      const { targetAmount, message, description } = req.body;

      // basic validations
      if (!targetAmount || targetAmount <= 0) {
        return res
          .status(400)
          .json({ message: "Invalid donation targetAmount" });
      }

      // ✅ image path
      const image = req.file ? req.file.location : null;

      const donation = await Donation.create({
        targetAmount,
        message,
        description,
        image,        
        user: req.userId,
      });
      res.status(201).json(donation);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message})
    }
} 

export const donateToCampaign = async (req, res) => {
  try {
    const { campaignId, amount, donorName, paymentMethod } = req.body;

    const donationAmount = Number(amount);

    // ✅ FIXED validation
    if (!campaignId || donationAmount <= 0) {
      return res.status(400).json({
        message: "Invalid donation data",
      });
    }

    const campaign = await Donation.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    if (!campaign.isActive) {
      return res.status(400).json({
        message: "Campaign closed",
      });
    }

    // ✅ create transaction with defaults
    const transaction = await Transaction.create({
      campaign: campaignId,
      amount: donationAmount,
      donorName: donorName || "Anonymous",
      paymentMethod: paymentMethod || "upi",
    });

    // update campaign amount
    campaign.amountRaised = Number(campaign.amountRaised || 0) + donationAmount;

    if (campaign.amountRaised >= campaign.targetAmount) {
      campaign.isActive = false;
    }

    await campaign.save();

    res.status(200).json({
      message: "Donation successful",
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyDonations = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 25
        const skip = (page - 1) * limit;

        const totalDonations = await Donation.countDocuments({
            user: req.userId,
        });

        const donations = await Donation.find({ user: req.userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
        
        res.json({
            donations,
            currentPage: page,
            totalPages: Math.ceil(totalDonations/limit),
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const getAllDonations = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 25;
        const skip = (page - 1) * limit;

        const totalDonations = await Donation.countDocuments();


        const donations = await Donation.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
        
        res.json({
          donations,
          currentPage: page,
          totalPages: Math.ceil(totalDonations / limit),
          totalDonations,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
        
    }
}

//delete donations
export const deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        
        if (!donation) {
            return res.status(404).json({message: "donation not found"})
        }

        //Ownership check
        if (donation.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Not Authorized" });
        }

        await donation.deleteOne()

        res.json({ message: "Donation Deleted Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message})
    }
}

export const updateDonation = async (req, res) => {
    try {
        const { targetAmount, message, description } = req.body;

        const donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({ message: "donation not found" });
        }

        //Ownership check
        if (donation.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Not Authorized" });
        }
        
        // update only if provided
        if (targetAmount) donation.targetAmount = targetAmount;
        if (message) donation.message = message;
        if (description) donation.description = description;

        if (req.file) donation.image = req.file.location;


        const updateDonation = await donation.save();

        res.json(updateDonation)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};