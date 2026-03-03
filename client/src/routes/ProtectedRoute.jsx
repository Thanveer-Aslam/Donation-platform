import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // ✅ Logged in
  return children;
};

export default ProtectedRoute;
