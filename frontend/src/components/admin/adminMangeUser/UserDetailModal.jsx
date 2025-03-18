import React, { useEffect, useState, useCallback } from "react";
import { Modal, Table, Spin, message, Switch, Input } from "antd";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";

const UserDetailModal = ({ visible, onClose, user }) => {
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortedInfo, setSortedInfo] = useState([]);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (visible && user?.uid) {
      fetchChatbots(user.uid);
    }
  }, [visible, user]);

  const fetchChatbots = async (userUid) => {
    if (!accessToken) {
      message.error("No access token found");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/admin/chatbots/${userUid}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch chatbots");
      const data = await response.json();
      setChatbots(data);
    } catch (error) {
      message.error("Error fetching chatbots");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = useCallback(
    async (record) => {
      const newStatus = record.status === "able" ? "disable" : "able";

      try {
        let updatedPermissionUid = null;

        if (newStatus === "able") {
          const response = await fetch("/api/v1/admin/permissions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              user_uid: user.uid,
              chatbot_uid: record.uid,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to enable chatbot");
          }

          const responseData = await response.json();
          updatedPermissionUid = responseData.uid;
        } else {
          await fetch(`/api/v1/admin/permissions/${record.permission_uid}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }

        setChatbots((prev) =>
          prev.map((cb) =>
            cb.uid === record.uid
              ? {
                  ...cb,
                  status: newStatus,
                  permission_uid: updatedPermissionUid,
                }
              : cb
          )
        );
        if (newStatus == "able") {
          message.success(`Chatbot ${record.name} is now ${newStatus}`);
        }
        if (newStatus == "disable") {
          message.warning(`Chatbot ${record.name} is now ${newStatus}`);
        }
      } catch (error) {
        message.error("Failed to update status");
      }
    },
    [accessToken, user]
  );

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const handleChange = (pagination, filters, sorter) => {
    const newSortedInfo = sortedInfo.filter(
      (item) => item.columnKey !== sorter.columnKey
    );

    if (sorter.order) {
      newSortedInfo.push({ columnKey: sorter.columnKey, order: sorter.order });
    }

    setSortedInfo(newSortedInfo);
  };

  const filteredChatbots = chatbots.filter((cb) =>
    cb.name.toLowerCase().includes(searchText)
  );

  const sortedChatbots = [...filteredChatbots].sort((a, b) => {
    for (const sortInfo of sortedInfo) {
      const { columnKey, order } = sortInfo;
      if (order === "ascend") {
        return a[columnKey] < b[columnKey] ? -1 : 1;
      } else if (order === "descend") {
        return a[columnKey] > b[columnKey] ? -1 : 1;
      }
    }
    return 0;
  });

  const renderSortableHeader = (title, columnKey) => {
    const sortInfo = sortedInfo.find((item) => item.columnKey === columnKey);
    const sortOrder = sortInfo ? sortInfo.order : null;

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>{title}</span>
        {sortOrder && (
          <span style={{ marginLeft: 8 }}>
            {sortOrder === "ascend" ? (
              <CaretUpOutlined />
            ) : (
              <CaretDownOutlined />
            )}
          </span>
        )}
      </div>
    );
  };

  const columns = [
    {
      title: renderSortableHeader("Name", "name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: renderSortableHeader("Version", "version"),
      dataIndex: "version",
      key: "version",
      sorter: true,
    },
    {
      title: renderSortableHeader("Status", "status"),
      key: "status",
      render: (_, record) => (
        <Switch
          checked={record.status === "able"}
          onChange={() => handleToggle(record)}
        />
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  return (
    <Modal
      title={`User: ${user?.username}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Input
        placeholder="Search chatbots"
        onChange={handleSearch}
        style={{ marginBottom: 10 }}
      />
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={sortedChatbots}
          rowKey="uid"
          onChange={handleChange}
          scroll={{ y: "350px" }}
        />
      )}
    </Modal>
  );
};

export default UserDetailModal;
