import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatInput from "../../components/chatInput/ChatInput";
import "./dashboardPage.css";
import ChatBotSelector from "../../components/chatBotSelector/ChatBotSelector";
import DocumentManager from "../../components/documentManager/DocumentManager";
import { createConversation } from "../../services/chat/conversationService";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [documentManagerOpen, setDocumentManagerOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [isChatFile, setChatFile] = useState(false);

  const submitNewMessage = async () => {
    if (!newMessage.trim()) {
      console.error("No message entered!");
      return;
    }

    try {
      setIsLoading(true);
      const data = await createConversation({
        chatbot_uid: selectedChatbot,
        title: newMessage,
      });
      if (data.uid) {
        navigate(`/chats/${data.uid}`, {
          state: { initialMessage: newMessage },
        });
      } else {
        console.error("Response does not contain uid");
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-chat-page">
      {isChatFile && (
        <DocumentManager
          open={documentManagerOpen}
          setOpen={setDocumentManagerOpen}
        />
      )}

      <div className="dashboard-chatbot-wrapper">
        <ChatBotSelector
          selectedChatbot={selectedChatbot}
          setSelectedChatbot={setSelectedChatbot}
          setChatFile={setChatFile}
        />
      </div>
      <div className="dashboard-title">
        {!selectedChatbot && <h3>Choosing a model and chat with me!</h3>}
      </div>

      <div className="dashboard-chat-input">
        {selectedChatbot && (
          <ChatInput
            newMessage={newMessage}
            isLoading={isLoading}
            setNewMessage={setNewMessage}
            submitNewMessage={submitNewMessage}
            setOpen={setDocumentManagerOpen}
            isChatFile={isChatFile}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
