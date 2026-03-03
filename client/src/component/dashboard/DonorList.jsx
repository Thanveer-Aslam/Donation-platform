import React from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";

export default function DonorList({ donors }) {
  if (!donors || donors.length === 0) {
    return <p className="text-zinc-400">No donors yet for this campaign.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full text-sm text-left">
        <thead className="border-b border-zinc-700 text-zinc-400">
          <tr>
            <th className="py-2">Donor</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Method</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {donors.map((d) => (
            <tr
              key={d._id}
              className="border-b border-zinc-800 
              hover:bg-zinc-900/60
              transition-colors"
            >
              {/* Donor */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-purple-600 text-white">
                      {d.donorName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <span className="font-medium text-white">{d.donorName}</span>
                </div>
              </td>

              {/* Amount */}
              <td className="px-4 py-3 font-semibold text-green-400">
                ₹{d.amount}
              </td>

              {/* Method */}
              <td className="px-4 py-3">
                <Badge
                  variant="secondary"
                  className="uppercase bg-zinc-800 text-zinc-300"
                >
                  {d.paymentMethod}
                </Badge>
              </td>

              {/* Date */}
              <td className="px-4 py-3 text-zinc-400">
                {new Date(d.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
