import React, { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Button } from "antd";
import "./chatBotSelector.css";
import { getUserChatbots } from "../../services/chatbot/chatbotService";

const ChatBotSelector = ({ setSelectedChatbot, setChatFile }) => {
  const [chatbotOptions, setChatbotOptions] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("Select model");

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const chatbots = await getUserChatbots();
        setChatbotOptions(chatbots);
      } catch (error) {
        console.error("Error fetching chatbot list:", error);
      }
    };

    fetchChatbots();
  }, []);

  const handleSelect = ({ key }) => {
    const selected = chatbotOptions.find((item) => item.key === key);

    if (selected) {
      setSelectedChatbot(selected.key);
      setSelectedLabel(selected.label);
      setChatFile(!!selected.chat_with_file);
    }
  };

  return (
    <div className="chatbot-selector">
      <Dropdown
        menu={{
          items: chatbotOptions.map(({ label, key }) => ({ label, key })),
          onClick: handleSelect,
        }}
        trigger={["click"]}
        placement="top"
      >
        <Button>
          <Space>
            {selectedLabel}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
};

export default ChatBotSelector;
