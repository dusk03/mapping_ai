import React from "react";
import { Outlet } from "react-router-dom";
import ChatList from "../../components/chatList/ChatList";
import "./dashboardLayout.css";

const DashboardLayout = () => {
  return (
    <div className="dashboardLayout">
      <div className="menu">
        <ChatList />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
