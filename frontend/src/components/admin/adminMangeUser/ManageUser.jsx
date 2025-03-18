import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Tag, message } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import UserDetailModal from "../../../components/admin/adminMangeUser/UserDetailModal";
import "./manageUser.css";
import { fetchUsers } from "../../../services/admin/adminService";
import { useQuery } from "@tanstack/react-query";

const ManageUsers = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // 5 phút cache
    retry: 1,
    onError: () => message.error("Error fetching users"),
  });

  const handleOpenModal = (record) => {
    setSelectedUser(record);
    setIsModalVisible(true);
  };

  const columns = [
    { title: "UID", dataIndex: "uid", key: "uid", width: "20%" },
    { title: "Username", dataIndex: "username", key: "username", width: "15%" },
    { title: "Email", dataIndex: "email", key: "email", width: "20%" },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      width: "10%",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      width: "10%",
    },
    {
      title: "Verified",
      dataIndex: "is_verified",
      key: "is_verified",
      width: "10%",
      render: (verified) => (
        <Tag className={verified ? "tag-verified" : "tag-unverified"}>
          {verified ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Chatbots",
      key: "chatbots",
      width: "15%",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleOpenModal(record)}>
          Change
        </Button>
      ),
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText)
  );

  return (
    <div className="manage-users-container">
      <h2 className="manage-users-title">Manage Users</h2>
      <Space className="manage-users-toolbar">
        <Input
          className="manage-users-search"
          placeholder="Search by username or email"
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => setSearchText(e.target.value.toLowerCase())}
        />
        <Button
          className="manage-users-refresh"
          icon={<ReloadOutlined />}
          onClick={refetch}
          loading={isLoading}
        >
          Refresh
        </Button>
      </Space>
      <Table
        className="manage-users-table"
        columns={columns}
        dataSource={filteredUsers}
        rowKey="uid"
        loading={isLoading}
        pagination={{ pageSize: 5 }}
        bordered
      />
      <UserDetailModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default ManageUsers;
