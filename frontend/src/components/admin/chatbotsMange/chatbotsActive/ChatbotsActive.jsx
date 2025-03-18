import React, { useState } from "react";
import {
  Table,
  Button,
  Typography,
  message,
  Popconfirm,
  Space,
  Input,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchChatbots,
  deleteChatbot,
} from "../../../../services/admin/adminService";
import "./chatbotsActive.css";

const { Title } = Typography;
const { Search } = Input;

const ChatbotsActive = () => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [deletingUid, setDeletingUid] = useState(null);

  const handleDelete = (uid) => {
    setDeletingUid(uid);
    mutation.mutate(uid, {
      onSuccess: () => {
        message.success("Chatbot deleted successfully!");
        queryClient.setQueryData(["chatbots"], (oldData) =>
          oldData?.filter((item) => item.uid !== uid)
        );
      },
      onError: () => message.error("Failed to delete chatbot!"),
      onSettled: () => setDeletingUid(null),
    });
  };

  const { data: chatbots = [], isLoading } = useQuery({
    queryKey: ["chatbots"],
    queryFn: fetchChatbots,
    staleTime: 1000 * 60 * 5,
    onError: () => message.error("Failed to fetch chatbots!"),
  });

  const mutation = useMutation({
    mutationFn: deleteChatbot,
    onSuccess: (_, uid) => {
      queryClient.setQueryData(["chatbots"], (oldData) =>
        oldData?.filter((item) => item.uid !== uid)
      );
    },
  });

  const handleRefresh = () =>
    queryClient.invalidateQueries({ queryKey: ["chatbots"] });

  const filteredChatbots = chatbots.filter((bot) =>
    bot.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", width: 150 },
    { title: "Version", dataIndex: "version", key: "version", width: 120 },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleString(),
      width: 200,
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) => new Date(text).toLocaleString(),
      width: 200,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) =>
        record.name !== "Aime-RAG" ? (
          <Popconfirm
            title="Are you sure to delete this chatbot?"
            onConfirm={() => handleDelete(record.uid)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger loading={deletingUid === record.uid}>
              Delete
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <div className="chatbots-container">
      <Space
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Active Chatbots
        </Title>
        <Space>
          <Search
            placeholder="Search by name"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button type="default" onClick={handleRefresh}>
            Refresh
          </Button>
        </Space>
      </Space>

      <Table
        className="chatbots-table"
        dataSource={filteredChatbots}
        columns={columns}
        loading={isLoading}
        rowKey="uid"
        scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
      />
    </div>
  );
};

export default ChatbotsActive;
