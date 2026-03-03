import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CreatorDashboard from "./pages/CreatorDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import CreatorCampaigns from "./pages/CreatorCampaigns";
import CreatorDonors from "./pages/CreatorDonors";
import CreatorSettings from "./pages/CreatorSettings";
import CampaignDetails from "./pages/CampaignDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌍 Public / Donor */}
        <Route path="/" element={<Home />} />
        <Route path="/campaign/:id" element={<CampaignDetails />} />

        {/* 🔐 Auth */}
        <Route path="/auth" element={<Auth />} />

        {/* 🧑‍💼 Creator */}
        <Route
          path="/creator/dashboard"
          element={
            <ProtectedRoute>
              <CreatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/campaigns"
          element={
            <ProtectedRoute>
              <CreatorCampaigns />
            </ProtectedRoute>
          }
        />

        <Route path="/creator/donors" element={<CreatorDonors />} />

        <Route path="/creator/settings" element={<CreatorSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
