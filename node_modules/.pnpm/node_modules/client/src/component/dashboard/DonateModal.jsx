import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

// import { donateToCampaign } from "../../api/donations";
// import API from "../../api/donations";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../api/donations";


export default function DonateModal({ open, onClose, campaign, onSuccess }) {
  const [form, setForm] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    donorAddress: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  if (!campaign) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDonate = async () => {
    if (!form.amount || form.amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      setLoading(true);

      // ✅ STEP 1: Create order
      const { data } = await createRazorpayOrder({
        amount: form.amount,
        campaignId: campaign._id,
        donorName: form.donorName,
        donorEmail: form.donorEmail,
        donorPhone: form.donorPhone,
        donorAddress: form.donorAddress,
      });

      // ✅ STEP 2: Razorpay popup
      const options = {
        key: data.key, // your real key
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,

        name: "Donation",
        description: campaign.message,

        handler: async function (response) {
          // ✅ STEP 3: Verify payment
          await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,

            campaignId: campaign._id,
            amount: form.amount,
            donorName: form.donorName,
            donorEmail: form.donorEmail,
            donorPhone: form.donorPhone,
            donorAddress: form.donorAddress,
          });

          alert("Payment successful ❤️");

          onSuccess?.();
          onClose();
        },

        prefill: {
          name: form.donorName,
          email: form.donorEmail,
          contact: form.donorPhone,
        },

        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>Donate to {campaign.message}</DialogTitle>
        </DialogHeader>

        {/* Campaign Image */}
        {/* {campaign.image && (
          <img
            src={`http://localhost:5000${campaign.image}`}
            className="w-full h-40 object-cover rounded-lg"
          />
        )} */}

        {/* Amount */}
        <Input
          name="amount"
          type="number"
          placeholder="Enter amount (₹)"
          value={form.amount}
          onChange={handleChange}
        />

        {/* Name */}
        <Input
          name="donorName"
          placeholder="Full Name"
          value={form.donorName}
          onChange={handleChange}
        />

        {/* Email */}
        <Input
          name="donorEmail"
          type="email"
          placeholder="Email"
          value={form.donorEmail}
          onChange={handleChange}
        />

        {/* Phone */}
        <Input
          name="donorPhone"
          placeholder="Phone Number"
          value={form.donorPhone}
          onChange={handleChange}
        />

        {/* Address */}
        <Textarea
          name="donorAddress"
          placeholder="Address"
          value={form.donorAddress}
          onChange={handleChange}
        />

        {/* Donate Button */}
        <Button
          onClick={handleDonate}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 w-full"
        >
          {loading ? "Processing..." : "Donate"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
