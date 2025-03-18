import { useState, useEffect } from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import "./chatList.css";
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, List, Modal, Spin } from "antd";
import {
  deleteChat,
  updateChatTitle,
  getChats,
} from "../../services/chat/conversationService";

import { useLocation } from "react-router-dom";

const ChatList = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChat, setEditingChat] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getChats();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [location.pathname]);

  const handleEdit = (chat) => {
    setEditingChat(chat);
    setNewTitle(chat.title);
  };

  const handleDelete = async (chatId) => {
    Modal.confirm({
      title: "Are you sure to delete this chat",
      content: "This action will delete permanently",
      onOk: async () => {
        try {
          await deleteChat(chatId);
          if (id === chatId) {
            navigate("/dashboard");
          } else {
            setChats(chats.filter((chat) => chat.uid !== chatId));
          }
        } catch (error) {
          console.error("Error deleting chat:", error);
        }
      },
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateChatTitle(editingChat.uid, newTitle);
      setChats(
        chats.map((chat) =>
          chat.uid === editingChat.uid ? { ...chat, title: newTitle } : chat
        )
      );
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  };

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore Lama AI</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className="title">RECENT CHATS</span>

      {loading ? (
        <Spin />
      ) : (
        <List
          dataSource={chats}
          renderItem={(chat) => {
            const items = [
              {
                key: "edit",
                label: "Rename",
                icon: <EditOutlined />,
                onClick: () => handleEdit(chat),
              },
              {
                key: "delete",
                label: "Delete",
                icon: <DeleteOutlined />,
                onClick: () => handleDelete(chat.uid),
              },
            ];

            return (
              <List.Item
                actions={[
                  <Dropdown menu={{ items }} trigger={["click"]} key="more">
                    <MoreOutlined style={{ cursor: "pointer" }} />
                  </Dropdown>,
                ]}
              >
                <Link to={`/chats/${chat.uid}`}>{chat.title}</Link>
              </List.Item>
            );
          }}
        />
      )}
      <hr />
      <div className="upgrade">
        <div className="texts">
          <span>Upgrade to Lama AI Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>

      <Modal
        title="Change chat title"
        open={!!editingChat}
        onCancel={() => setEditingChat(null)}
        footer={[
          <Button key="cancel" onClick={() => setEditingChat(null)}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            onClick={async () => {
              await handleSaveEdit();
              setEditingChat(null);
            }}
          >
            Confirm
          </Button>,
        ]}
      >
        <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
      </Modal>
    </div>
  );
};

export default ChatList;
