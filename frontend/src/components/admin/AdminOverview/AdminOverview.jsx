import { Card, Row, Col } from "antd";
import {
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./adminOverview.css";

const AdminOverview = () => {
  return (
    <div className="admin-dashboard">
      <h2>Dashboard Overview</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card className="dashboard-card" title="Total Users" bordered={false}>
            <UserOutlined className="dashboard-icon" />
            <p>1,024</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            className="dashboard-card"
            title="Active Sessions"
            bordered={false}
          >
            <BarChartOutlined className="dashboard-icon" />
            <p>256</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="dashboard-card" title="Settings" bordered={false}>
            <SettingOutlined className="dashboard-icon" />
            <p>5 Configurations</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminOverview;
