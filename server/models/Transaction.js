import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    donorName: {
      type: String,
      default: "Anonymous",
    },

    donorEmail: {
      type: String,
      default: null,
    },

    donorPhone: {
      type: String,
      default: null,
    },

    donorAddress: {
      type: String,
      default: null,
    },

    paymentMethod: {
      type: String,
      default: "manual",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "success"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
