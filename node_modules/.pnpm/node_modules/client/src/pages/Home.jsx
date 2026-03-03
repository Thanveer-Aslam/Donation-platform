import { useEffect, useState } from "react";
import { fetchDonations } from "../api/donations";
import { useNavigate } from "react-router-dom";

import CampaignCard from "../component/CampaignCard";
import DonateModal from "../component/dashboard/DonateModal";

const Home = () => {
  const [donations, setDonations] = useState([]);

  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [showDonate, setShowDonate] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const res = await fetchDonations();

    setDonations(res.data.donations);
  };

  // open modal
  // const handleDonateClick = (campaign) => {
  //   setSelectedCampaign(campaign);
  //   setShowDonate(true);
  // };

  // update UI after donate
  const handleDonateSuccess = () => {
    loadCampaigns();
  };
  
  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-2xl font-semibold mb-6">All Campaigns</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {donations.map((donation) => (
          <CampaignCard
            key={donation._id}
            campaign={donation}
            onDonate={() => navigate(`/campaign/${donation._id}`)}
          />
        ))}
      </div>

      {/* <DonateModal
        open={showDonate}
        onClose={() => setShowDonate(false)}
        campaign={selectedCampaign}
        onSuccess={handleDonateSuccess}
      /> */}
    </div>
  );
};

export default Home;
