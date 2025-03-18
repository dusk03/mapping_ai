import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./adminSideBar.css";

const { Sider } = Layout;

const AdminSidebar = () => {
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname === "/admin") return "1";
    if (location.pathname.startsWith("/admin/users")) return "2";
    if (location.pathname.startsWith("/admin/chatbots")) return "3";
    return "1";
  };

  return (
    <Sider collapsible className="admin-sidebar" style={{ height: "100vh" }}>
      <div className="admin-logo">Panel</div>
      <Menu theme="dark" mode="inline" selectedKeys={[getSelectedKey()]}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/admin">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/admin/users">Manage Users</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<SettingOutlined />}>
          <Link to="/admin/chatbots">Chatbots</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AdminSidebar;
