import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // this line was inside api/donation.js
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


/* =========================
   CREATOR ACTIONS
========================= */

// ✅ FIXED
export const createCampaign = (formData) =>
  API.post("/donations", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Delete campaign
export const deleteCampaign = (id) => API.delete(`/donations/${id}`);

// Update campaign
export const updateCampaign = (id, formData) =>
  API.put(`/donations/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Get creator campaigns
export const fetchMyDonations = () => API.get("/donations/my");

// Donate to campaign
export const donateToCampaign = (data) => API.post("/transactions/donate", data);

// Creator stats
export const fetchCreatorStats = () => API.get("/transactions/stats");

/* =========================
   DONOR / PUBLIC
========================= */

// Get all campaigns
export const fetchDonations = (page = 1) => API.get(`/donations?page=${page}`);

// Get recent transactions
export const fetchRecentTransactions = () => API.get("/transactions/recent");

// Get campaign donors
export const fetchCampaignDonors = (campaignId) =>
  API.get(`/transactions/campaign/${campaignId}`);

/* =========================
   PAYMENT (RAZORPAY)
========================= */

export const createRazorpayOrder = (data) =>
  API.post("/payment/create-order", data);

export const verifyRazorpayPayment = (data) =>
  API.post("/payment/verify-payment", data);

export default API;

// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// /* =========================
//    CREATOR ACTIONS
// ========================= */

// // Create campaign
// export const createCampaign = (formData) =>
//   API.post("/donations/create", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

// // Delete campaign
// export const deleteCampaign = (id) => API.delete(`/donations/${id}`);

// // UPDATE campaign
// export const updateCampaign = (id, formData) =>
//   API.put(`/donations/${id}`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

// // Get creator campaigns
// // export const fetchMyDonations = (page = 1) =>
// //   API.get(`/donations/my?page=${page}`);

// export const fetchMyDonations = () => API.get("/donations/my");

// // 🟢 DONOR → Donate to campaign
// // export const donateToCampaign = (data) =>
// //   API.post("/transactions/donate", data);

// export const donateToCampaign = (data) => API.post("/donations/donate", data);

// //creator stats

// export const fetchCreatorStats = () => API.get("/transactions/stats");

// /* =========================
//    DONOR / PUBLIC
// ========================= */

// // Get all campaigns
// export const fetchDonations = (page = 1) => API.get(`/donations?page=${page}`);

// //Get all Recent Trnasaction
// export const fetchRecentTransactions = () => API.get("/transactions/recent");

// // 🔵 Get donors for specific campaign
// export const fetchCampaignDonors = (campaignId) =>
//   API.get(`/transactions/campaign/${campaignId}`);

// export default API;
