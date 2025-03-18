import React, { useRef } from "react";
import useAutosize from "../../hooks/useAutosize";
import sendIcon from "../../assets/send.svg";
import "./chatInput.css";
import { Button, Tooltip } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function ChatInput({
  newMessage,
  isLoading,
  setNewMessage,
  submitNewMessage,
  setOpen,
  isChatFile,
}) {
  const textareaRef = useAutosize(newMessage);
  const fileInputRef = useRef(null);

  function handleKeyDown(e) {
    if (e.keyCode === 13 && !e.shiftKey && !isLoading) {
      e.preventDefault();
      submitNewMessage();
    }
  }

  function handleUploadClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(event) {
    const files = event.target.files;
    if (files.length > 0) {
    }
  }

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          multiple
          onChange={handleFileChange}
        />

        {isChatFile && (
          <Tooltip>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleUploadClick}
              className="chat-upload-button"
            />
          </Tooltip>
        )}
        <textarea
          className="chat-textarea"
          ref={textareaRef}
          rows="1"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button
          className="chat-send-button"
          onClick={submitNewMessage}
          disabled={isLoading}
        >
          <img src={sendIcon} alt="send" className="chat-send-icon" />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
