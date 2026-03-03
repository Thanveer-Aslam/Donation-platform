import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-950">
      {/* 🔍 Search */}
      <div className="flex items-center gap-2 w-1/3 bg-zinc-900 px-3 py-2 rounded-lg">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          placeholder="Search campaign, donor and more..."
          className="w-full bg-transparent outline-none text-sm text-zinc-200"
        />
      </div>

      {/* 👤 Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600">
            <Avatar className="h-9 w-9">
              {/* If you later add image */}
              {/* <AvatarImage src={user?.avatar} /> */}

              <AvatarFallback className="bg-purple-600 text-white font-semibold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-44 bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2"
        >
          <DropdownMenuItem
            className="cursor-pointer hover:bg-zinc-800 text-lg font-semibold"
            onClick={() => navigate("/profile")}
          >
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer hover:bg-zinc-800 text-lg font-semibold"
            onClick={() => navigate("/settings")}
          >
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer text-red-400 hover:bg-red-500/10 text-lg font-semibold"
            onClick={onLogout}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
