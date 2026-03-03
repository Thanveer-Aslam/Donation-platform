import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";

export default function CampaignCard({
  campaign,
  isCreatorView = false,
  onDelete,
  onEdit,
  onDonate,
  onViewDonors,
}) {
  // 👆 campaign is ONE donation object

  const raised = Number(campaign.amountRaised) || 0;
  const target = Number(campaign.targetAmount) || 0;

  const progress = target > 0 ? Math.min((raised / target) * 100, 100) : 0;

  return (
    <Card className="rounded-2xl shadow-md">
      <CardContent className="space-y-4 pt-6">
        {/* Image */}
        {campaign.image && (
          <img
            src={campaign.image}
            className="w-full h-40 object-cover rounded-lg"
          />
        )}

        {/* title */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {campaign.message || "No Title"}
          </h2>
          <Badge variant={campaign.isActive ? "secondary" : "outline"}>
            {campaign.isActive ? "Live" : "Closed"}
          </Badge>
        </div>

        {/* Description */}
        {campaign.description && (
          <p className="text-sm text-zinc-400 line-clamp-2">
            {campaign.description}
          </p>
        )}

        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>₹{raised} Raised</span>
            <span>Goal ₹{target}</span>
          </div>

          {/* ✅ Progress Bar (CUSTOM – replaces shadcn Progress) */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="h-2 w-full bg-zinc-800 rounded">
              <div
                className="h-2 bg-purple-600 rounded transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {/* 🟢 DONOR VIEW */}
        {!isCreatorView && (
          <Button className="w-full" onClick={() => onDonate(campaign)}>
            Donate Now
          </Button>
        )}

        {/* 🔵 CREATOR VIEW */}
        {isCreatorView && (
          <div className="flex gap-2 mt-4 w-full">
            <Button
              onClick={() => onEdit(campaign)}
              className="flex-1 border p-2 rounded cursor-pointer"
            >
              Edit
            </Button>

            <Button
              onClick={() => onViewDonors(campaign)}
              className="border border-purple-500 text-purple-400"
            >
              View Donors
            </Button>

            <Button
              onClick={() => onDelete(campaign._id)}
              className="flex-1 bg-red-500 text-white p-2 rounded cursor-pointer"
            >
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
