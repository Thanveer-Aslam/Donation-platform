import { useEffect, useState } from "react";
import DashboardLayout from "../component/layout/DashboardLayout";
import StatsCards from "../component/dashboard/StatsCards";
import CampaignCard from "../component/CampaignCard";
import CreateCampaign from "./CreateCampaign";
import {
  fetchMyDonations,
  deleteCampaign,
  fetchCreatorStats,
} from "../api/donations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
// import RecentTransaction from "../component/dashboard/RecentTransaction";
import DonorList from "../component/dashboard/DonorList";
import { fetchCampaignDonors } from "../api/donations";

import axios from "axios";

export default function CreatorDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  // const [user, setUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [showDonors, setShowDonors] = useState(false);
  const [donors, setDonors] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  // const [recentTransactions, setRecentTransactions] = useState([]);

  // 🔹 Load profile
  // 
  
  //Load Profile
  // const loadProfile = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/api/auth/profile", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     setUser(res.data);
  //   } catch (error) {
  //     console.error(
  //       "Profile load failed:",
  //       error.response?.data || error.message,
  //     );
  //   }
  // };

  const handleViewDonors = async (campaign) => {
    setSelectedCampaign(campaign);
    setShowDonors(true);

    const res = await fetchCampaignDonors(campaign._id);
    setDonors(res.data);
  };

  // 🔹 Load campaigns
  // const loadCampaigns = async () => {
  //   const res = await fetchMyDonations();
  //   setCampaigns(res.data.donations);
  //   setLoading(false);
  // };

  // load campaigns

  const loadCampaigns = async () => {
    try {
      const res = await fetchMyDonations();
      setCampaigns(res.data.donations);
    } catch (error) {
      console.error(
        "Campaign load failed:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false); // ✅ ALWAYS runs
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetchCreatorStats();
      setStats(res.data);
    } catch (error) {
      console.error(
        "Stats load failed:",
        error.response?.data || error.message,
      );
    }
  };

  // const loadRecentTransactions = async () => {
  //   const res = await fetchRecentTransactions();
  //   setRecentTransactions(res.data);
  // };

  // 🔴 DELETE campaign
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;

    await deleteCampaign(id);
    setCampaigns((prev) => prev.filter((c) => c._id !== id));
  };

  useEffect(() => {
    // loadProfile();
    loadCampaigns();
    loadStats();
    // loadRecentTransactions();
    const interval = setInterval(loadCampaigns, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">My Campaigns</h1>
          {/* <p className="text-sm text-zinc-500">Logged in as {user?.name}</p> */}
        </div>

        <button
          onClick={() => {
            setEditingCampaign(null);
            setShowCreate(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          + Create Campaign
        </button>
      </div>

      {/* STATS */}
      <StatsCards stats={stats} />

      {/* Recent Transactions */}
      {/* <RecentTransaction transactions={recentTransactions} /> */}

      {/* CREATE / EDIT FORM */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md bg-zinc-900 text-white border-zinc-800">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? "Edit Campaign" : "Create Campaign"}
            </DialogTitle>
          </DialogHeader>

          <CreateCampaign
            campaign={editingCampaign}
            onSuccess={() => {
              setShowCreate(false);
              setEditingCampaign(null);
              loadCampaigns();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ✅ ADD DONOR DIALOG HERE */}
      <Dialog open={showDonors} onOpenChange={setShowDonors}>
        <DialogContent className="bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Donors — {selectedCampaign?.message}</DialogTitle>
          </DialogHeader>

          <DonorList donors={donors} />
        </DialogContent>
      </Dialog>

      {/* CAMPAIGNS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {campaigns.map((c) => (
          <CampaignCard
            key={c._id}
            campaign={c}
            isCreatorView
            onDelete={handleDelete}
            onEdit={(campaign) => {
              setEditingCampaign(campaign);
              setShowCreate(true);
            }}
            onViewDonors={handleViewDonors}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}
