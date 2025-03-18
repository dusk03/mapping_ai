// layouts/PublicLayout.jsx
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./publicLayout.css";
import { Button, Space } from "antd";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const PublicLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  return (
    <div className="rootLayout">
      <header>
        <Link to="/" className="logo">
          <span>MAPPING AI</span>
        </Link>
        <div className="user">
          {!user && (
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

export default PublicLayout;
