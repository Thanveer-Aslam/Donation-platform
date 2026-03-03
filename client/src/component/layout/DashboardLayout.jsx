import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/donations";

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data);
      } catch (error) {
        console.error("Profile load failed");
        navigate("/auth");
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar user={user} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto p-6 bg-zinc-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
