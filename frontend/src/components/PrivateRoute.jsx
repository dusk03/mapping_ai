// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user || user.user.role != "user") return <Navigate to="/sign-in" />;

  // return user.user.role === "user" ? children : <Navigate to="/" />;
  return children;
};

export default PrivateRoute;
