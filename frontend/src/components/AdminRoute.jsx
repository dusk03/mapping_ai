import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user || user.user.role != "admin") return <Navigate to="/sign-in" />;

  // return user.user.role === "admin" ? children : <Navigate to="/" />;
  return children;
};

export default AdminRoute;
