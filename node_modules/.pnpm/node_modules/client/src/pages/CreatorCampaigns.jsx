import { useEffect, useState } from "react";
import DashboardLayout from "../component/layout/DashboardLayout";
import CampaignCard from "../component/CampaignCard";
import { fetchMyDonations, deleteCampaign } from "../api/donations";

export default function CreatorCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useState("all");

  // 🔹 Load campaigns
  const loadCampaigns = async () => {
    const res = await fetchMyDonations();
    setCampaigns(res.data.donations);
  };

  useEffect(() => {
    loadCampaigns();
    const interval = setInterval(loadCampaigns, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Filter logic
  const filteredCampaigns = campaigns.filter((c) => {
    if (filter === "all") return true;
    if (filter === "active") return c.isActive;
    if (filter === "closed") return !c.isActive;
    return true;
  });

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
      </div>

      {/* ✅ FILTER BUTTONS */}
      <div className="flex gap-3 mb-8">
        {["all", "active", "closed"].map((type) => {
          const isActive = filter === type;

          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`
                relative px-5 py-2 rounded-lg capitalize text-sm font-medium
                transition-all duration-200 ease-out
                ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg scale-[1.03]"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                }
              `}
            >
              {type}

              {/* Active underline */}
              {isActive && (
                <span className="absolute left-2 right-2 -bottom-1 h-[2px] bg-purple-400 rounded" />
              )}
            </button>
          );
        })}
      </div>

      {/* CAMPAIGN LIST */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.map((c) => (
          <CampaignCard
            key={c._id}
            campaign={c}
            isCreatorView
            onDelete={async () => {
              await deleteCampaign(c._id);
              loadCampaigns();
            }}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}
