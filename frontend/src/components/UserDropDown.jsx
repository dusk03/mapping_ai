import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Button, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { logout } from "../../services/auth"; // Import service logout

const UserDropdown = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      const isLoggedOut = await logout(accessToken);
      if (isLoggedOut) {
        navigate("/login");
      }
    }
  };

  const menuItems = [
    {
      label: <Link to="#">Profile</Link>,
      key: "profile",
    },
    {
      label: (
        <Button type="link" onClick={handleLogout}>
          Logout
        </Button>
      ),
      key: "logout",
    },
  ];

  const menu = <Menu items={menuItems} />;

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button>
        User <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default UserDropdown;
