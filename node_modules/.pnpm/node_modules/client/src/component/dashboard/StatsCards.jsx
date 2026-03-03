const StatCard = ({ title, value }) => (
  <div className="bg-zinc-800 p-6 rounded-xl shadow-md">
    <p className="text-sm text-zinc-400">{title}</p>
    <h2 className="text-2xl font-bold mt-2 text-white">{value}</h2>
  </div>
);

export default function StatsCards({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <StatCard title="Total Raised" value={`₹${stats.totalRaised}`} />
      <StatCard title="Donations" value={stats.totalDonations} />
      <StatCard title="Active Campaigns" value={stats.activeCampaigns} />
      <StatCard title="Closed Campaigns" value={stats.closedCampaigns} />
    </div>
  );
}
