import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Spin,
  Alert,
  Button,
  message,
  Space,
  Input,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFreeChatbots,
  fetchChatbots,
  addChatbot,
} from "../../../../services/admin/adminService";
import "./chatbotsAdd.css";

const { Title } = Typography;
const { Search } = Input;

const ChatbotsAdd = () => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");

  const [addingSlug, setAddingSlug] = useState(null);

  const handleAddChatbot = (chatbot) => {
    setAddingSlug(chatbot.slug);
    mutation.mutate(chatbot, {
      onSuccess: (_, newChatbot) => {
        message.success(`Added chatbot: ${newChatbot.short_name}`);
        queryClient.invalidateQueries({ queryKey: ["existingChatbots"] });
      },
      onError: () => message.error("Failed to add chatbot"),
      onSettled: () => setAddingSlug(null),
    });
  };

  const {
    data: freeChatbots = [],
    isLoading: isLoadingFree,
    isError: isErrorFree,
    error: errorFree,
  } = useQuery({
    queryKey: ["freeChatbots"],
    queryFn: fetchFreeChatbots,
    staleTime: 1000 * 60 * 10,
    onError: () => message.error("Failed to fetch free chatbots"),
  });

  const {
    data: existingChatbots = [],
    isLoading: isLoadingExisting,
    isError: isErrorExisting,
  } = useQuery({
    queryKey: ["existingChatbots"],
    queryFn: fetchChatbots,
    staleTime: 1000 * 60 * 5,
    onError: () => message.error("Failed to fetch existing chatbots"),
  });

  const mutation = useMutation({
    mutationFn: addChatbot,
    onSuccess: (_, newChatbot) => {
      queryClient.invalidateQueries({ queryKey: ["existingChatbots"] });
    },
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["freeChatbots"] });
    queryClient.invalidateQueries({ queryKey: ["existingChatbots"] });
  };

  if (isLoadingFree || isLoadingExisting)
    return <Spin tip="Loading chatbots..." />;
  if (isErrorFree)
    return (
      <Alert message={`Error: ${errorFree?.message}`} type="error" showIcon />
    );
  if (isErrorExisting)
    return (
      <Alert message="Error fetching existing chatbots" type="error" showIcon />
    );

  const filteredChatbots = freeChatbots
    .filter(
      (chatbot) => !existingChatbots.some((e) => e.code_name === chatbot.slug)
    )
    .filter((chatbot) =>
      chatbot.short_name?.toLowerCase().includes(searchText.toLowerCase())
    );

  const columns = [
    {
      title: "Chatbot Name",
      dataIndex: "short_name",
      key: "short_name",
      width: 250,
    },
    { title: "Author", dataIndex: "author", key: "author", width: 200 },
    {
      title: "Context Length",
      dataIndex: "context_length",
      key: "context_length",
      width: 150,
    },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleAddChatbot(record)}
          loading={addingSlug === record.slug}
        >
          ADD
        </Button>
      ),
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
          Available Free Chatbots
        </Title>
        <Space>
          <Search
            placeholder="Search by name"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button className="button-refresh" onClick={handleRefresh}>
            Refresh
          </Button>
        </Space>
      </Space>

      <div className="chatbots-table">
        <Table
          dataSource={filteredChatbots}
          columns={columns}
          rowKey="slug"
          scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
          tableLayout="fixed"
        />
      </div>
    </div>
  );
};

export default ChatbotsAdd;
