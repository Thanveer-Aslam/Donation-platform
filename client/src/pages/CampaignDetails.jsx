import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDonations } from "../api/donations";
import DonateModal from "../component/dashboard/DonateModal";

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [showDonate, setShowDonate] = useState(false);

  useEffect(() => {
    loadCampaign();
  }, []);

  const loadCampaign = async () => {
    const res = await fetchDonations();
    const found = res.data.donations.find((c) => c._id === id);
    setCampaign(found);
  };

  if (!campaign) return <p className="p-6">Loading...</p>;

  const raised = Number(campaign.amountRaised) || 0;
  const target = Number(campaign.targetAmount) || 0;
  const progress = target > 0 ? (raised / target) * 100 : 0;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Image */}
      <div className="w-full h-96 overflow-hidden">
        <img src={campaign.image} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold">{campaign.message}</h1>

        <p className="mt-6 text-zinc-400 leading-relaxed">
          {campaign.description}
        </p>

        {/* Progress */}
        <div className="mt-8">
          <div className="flex justify-between text-sm mb-2">
            <span>₹{raised} Raised</span>
            <span>Goal ₹{target}</span>
          </div>

          <div className="h-3 bg-zinc-800 rounded">
            <div
              className="h-3 bg-purple-600 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Donate Button */}
        <button
          onClick={() => setShowDonate(true)}
          className="mt-10 bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg text-lg font-semibold"
        >
          Donate Now
        </button>
      </div>

      <DonateModal
        open={showDonate}
        onClose={() => setShowDonate(false)}
        campaign={campaign}
      />
    </div>
  );
}
