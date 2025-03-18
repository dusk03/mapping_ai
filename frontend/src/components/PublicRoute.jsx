// routes/PublicRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // hoặc spinner nếu muốn
  if (user) {
    return (
      <Navigate
        to={user?.user?.role === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return children;
};

export default PublicRoute;
