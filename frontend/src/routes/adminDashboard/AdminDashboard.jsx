import { Layout, Button } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminSidebar from "../../components/admin/AdminSideBar";
import "./adminDashboard.css";

const { Header, Content } = Layout;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/sign-in");
  };

  return (
    <Layout className="admin-layout">
      <AdminSidebar />
      <Layout>
        <Header className="admin-header">
          <span>Admin Dashboard</span>
          <Button type="primary" onClick={handleLogout} className="logout-btn">
            Logout
          </Button>
        </Header>
        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
