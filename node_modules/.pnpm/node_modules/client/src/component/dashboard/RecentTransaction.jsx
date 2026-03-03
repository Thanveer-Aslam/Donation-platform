import React from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";

const RecentTransaction = ({ transactions }) => {
  if (!transactions || transactions.length === 0)
    return <p className="text-zinc-400 mt-6">No transactions yet.</p>;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mt-10">
      <h2 className="text-xl font-semibold text-white mb-6">
        Recent Transaction
      </h2>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400">
            <tr>
              <th className="p-4">Donor</th>
              <th className="p-4">Campaign</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Method</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t._id}
                className="border-b border-zinc-800
                  hover:bg-zinc-800/50
                  transition-colors"
              >
                {/* Donor */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-600 text-white">
                        {t.donorName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <span className="text-white font-medium">
                      {t.donorName}
                    </span>
                  </div>
                </td>

                {/* Campaign */}
                <td className="px-4 py-3 text-zinc-300">
                  {t.campaign?.message}
                </td>

                {/* Amount */}
                <td className="px-4 py-3 font-semibold text-green-400">
                  ₹{t.amount}
                </td>

                {/* Method */}
                <td className="px-4 py-3">
                  <Badge className="bg-zinc-800 text-zinc-300 uppercase">
                    {t.paymentMethod}
                  </Badge>
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-zinc-400">
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransaction;