import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./rootLayout.css";
import { Button, Dropdown, Menu, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null);
    navigate("/sign-in");
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
    <div className="rootLayout">
      <header>
        <Link to="/" className="logo">
          <span>MAPPING AI</span>
        </Link>
        <div className="user">
          {user ? (
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button>
                User <DownOutlined />
              </Button>
            </Dropdown>
          ) : (
            <Space>
              <Link to="/sign-in">
                <Button
                  type={
                    location.pathname === "/sign-in" ? "primary" : "default"
                  }
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button
                  type={
                    location.pathname === "/sign-up" ? "primary" : "default"
                  }
                >
                  Sign Up
                </Button>
              </Link>
            </Space>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
