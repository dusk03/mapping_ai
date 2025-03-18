import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ChatInput from "../../components/chatInput/ChatInput";
import ChatMessages from "../../components/chatMessages/ChatMessages";
import { Modal } from "antd";
import {
  fetchChatHistory,
  sendMessageToChatbot,
} from "../../services/chat/chatApi";
import "./chatPage.css";
import DocumentManager from "../../components/documentManager/DocumentManager";
import SuggestQuestion from "../../components/suggestQuestion/SuggestQuestion";
import { message } from "antd";

const ChatPage = () => {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || "";

  const { id } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [userQuest, setUserQuest] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [historyFetched, setHistoryFetched] = useState(false);

  const [chatbot, setChatbot] = useState("");
  const [isBanned, setIsBanned] = useState(false);

  const [isChatFile, setChatFile] = useState(false);
  const [documentManagerOpen, setDocumentManagerOpen] = useState(false);

  const hasSentInitialMessage = useRef(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await fetchChatHistory(id, token);
        if (data) {
          setMessages(data.messages);
          setChatbot(data.chatbot.name);
          setChatFile(data.chatbot.chat_with_file);
        }
      } catch (error) {
        if (error?.detail === "conversation not found") {
          message.error("Conversation not found. Redirecting to Dashboard...");
          navigate("/dashboard");
        } else {
          message.error("This chatbot instance has been deleted.");
        }
      } finally {
        setHistoryFetched(true);
      }
    };
    setUserQuest("");
    fetchHistory();
  }, [id]);

  useEffect(() => {
    if (
      historyFetched &&
      messages.length === 0 &&
      initialMessage &&
      !hasSentInitialMessage.current
    ) {
      hasSentInitialMessage.current = true;
      setNewMessage(initialMessage);
      submitNewMessage(initialMessage);
    }
  }, [historyFetched, messages]);

  const submitNewMessage = async (message) => {
    if (!message.trim()) return;
    setUserQuest(message);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: message, loading: false, error: false },
      { role: "assistant", content: "", loading: true, error: false }, // Thêm ngay ở đây
    ]);
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await sendMessageToChatbot(id, message, token);

      if (response.status === 403) {
        setIsBanned(true);
        throw new Error("Chatbot has been banned.");
      }

      if (!response.body) throw new Error("No response body from server");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.role === "assistant") {
            lastMsg.content += chunk;
          }
          return updated;
        });
      }

      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg.role === "assistant") lastMsg.loading = false;
        return updated;
      });
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg.role === "assistant") {
          lastMsg.error = true;
          lastMsg.loading = false;
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page">
      {isChatFile && (
        <DocumentManager
          open={documentManagerOpen}
          setOpen={setDocumentManagerOpen}
        />
      )}

      <h1 className="chat-title">Chat with {chatbot} </h1>
      <div className="chat-container">
        <ChatMessages messages={messages} isLoading={isLoading} />
        {isChatFile && (
          <SuggestQuestion
            messages={userQuest}
            onSelectSuggestion={setNewMessage}
          />
        )}

        <ChatInput
          newMessage={newMessage}
          isLoading={isLoading}
          setNewMessage={setNewMessage}
          submitNewMessage={() => submitNewMessage(newMessage)}
          setOpen={setDocumentManagerOpen}
          isChatFile={isChatFile}
        />
      </div>
      <Modal
        title="⚠️ Notification"
        open={isBanned}
        onOk={() => navigate("/dashboard")}
        okText="OK"
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{
          style: {
            backgroundColor: "#FFA500",
            borderColor: "#FFA500",
            color: "white",
          },
        }}
      >
        <p style={{ color: "#D35400", fontWeight: "bold" }}>
          You can not use this chatbot!
        </p>
      </Modal>
    </div>
  );
};

export default ChatPage;
