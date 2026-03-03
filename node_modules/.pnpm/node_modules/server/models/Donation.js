import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    targetAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // ✅ NEW — description
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    // ✅ NEW — image
    image: {
      type: String,
      default: null,
    },

    amountRaised: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;