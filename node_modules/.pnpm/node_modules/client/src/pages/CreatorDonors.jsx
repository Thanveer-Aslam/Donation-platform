import { useEffect, useState } from "react";
import DashboardLayout from "../component/layout/DashboardLayout";
import { fetchRecentTransactions } from "../api/donations";
import RecentTransaction from "../component/dashboard/RecentTransaction";

const CreatorDonors =() => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const res = await fetchRecentTransactions();
    setTransactions(res.data);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6">Donors & Transactions</h1>

      <RecentTransaction transactions={transactions} />
    </DashboardLayout>
  );
}

export default CreatorDonors;