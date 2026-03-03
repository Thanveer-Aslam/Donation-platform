// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Settings,
  HelpCircle,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#0b0b14] text-white hidden md:flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 text-xl font-bold tracking-wide">CHARITY</div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-2">
        <SidebarItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          to="/creator/dashboard"
        />
        <SidebarItem
          icon={<Megaphone size={18} />}
          label="Campaigns"
          to="/creator/campaigns"
        />
        <SidebarItem
          icon={<Users size={18} />}
          label="Donors"
          to="/creator/donors"
        />
        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          to="/creator/Settings"
        />
      </nav>

      {/* Support */}
      <div className="px-4 py-4 border-t border-white/10">
        <SidebarItem icon={<HelpCircle size={18} />} label="Help" />
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition
        ${
          isActive
            ? "bg-violet-600/20 text-violet-400"
            : "text-zinc-300 hover:bg-white/5"
        }`
      }
    >
      {icon}
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};

export default Sidebar;
