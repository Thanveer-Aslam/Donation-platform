import { useEffect, useState } from "react";
import DashboardLayout from "../component/layout/DashboardLayout";
import API from "../api/donations";

export default function CreatorSettings() {
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await API.get("/payment/settings");
      setKeyId(res.data.keyId || "");
      setIsConnected(res.data.isConnected);
    } catch (error) {
      console.error("Failed to load payment settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await API.post("/payment/connect", {
        keyId,
        keySecret,
      });

      setIsConnected(true);
      alert("Razorpay connected successfully 🚀");
    } catch (error) {
      alert(error.response?.data?.message || "Connection failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="p-6">Loading settings...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto bg-zinc-900 p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-6">Payment Settings</h1>

        {/* Status Badge */}
        <div className="mb-6">
          {isConnected ? (
            <span className="px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
              Razorpay Connected
            </span>
          ) : (
            <span className="px-4 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
              Not Connected
            </span>
          )}
        </div>

        {/* Key ID */}
        <div className="mb-4">
          <label className="block mb-2 text-sm text-zinc-400">
            Razorpay Key ID
          </label>
          <input
            type="text"
            value={keyId}
            onChange={(e) => setKeyId(e.target.value)}
            className="w-full p-3 bg-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="rzp_live_XXXXXXXXXXXX"
          />
        </div>

        {/* Key Secret */}
        <div className="mb-6">
          <label className="block mb-2 text-sm text-zinc-400">
            Razorpay Key Secret
          </label>
          <input
            type="password"
            value={keySecret}
            onChange={(e) => setKeySecret(e.target.value)}
            className="w-full p-3 bg-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter Secret Key"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : isConnected
              ? "Update Razorpay"
              : "Connect Razorpay"}
        </button>

        <p className="text-xs text-zinc-500 mt-4">
          Your secret key is securely stored and never exposed publicly.
        </p>
      </div>
    </DashboardLayout>
  );
}
