import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./chatbotsManage.css";

const ChatbotsManage = () => {
  return (
    <div className="chatbots-manage-container">
      <nav className="chatbots-nav">
        <ul>
          <li>
            <NavLink
              to="."
              end
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              All Chatbots Active
            </NavLink>
          </li>
          <li>
            <NavLink
              to="add"
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              Add New Chatbot
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="chatbots-content">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatbotsManage;
