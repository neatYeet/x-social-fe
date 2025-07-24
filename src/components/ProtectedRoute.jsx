import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("refresh_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
