import React from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import useAutoScroll from "../../hooks/useAutoSrcoll";
import Spinner from "../spinner/Spiner";
import userIcon from "../../assets/user.svg";
import errorIcon from "../../assets/error.svg";
import "./chatMessages.css";
import { Alert, Button } from "antd";

const convertPlainTextLinks = (text) => {
  return text.replace(/(?<!\])\b(https?:\/\/[^\s)]+)(?!\))/g, "[$1]($1)");
};

const ChatMessages = ({ messages }) => {
  const scrollContentRef = useAutoScroll([messages.length]);

  return (
    <div ref={scrollContentRef} className="chat-messages-container">
      {messages.map(({ role, content, loading, error }, idx) => (
        <div
          key={idx}
          className={`chat-message ${role === "user" ? "user" : "assistant"} ${
            loading ? "loading" : ""
          }`}
        >
          {role === "user" && (
            <img className="chat-avatar" src={userIcon} alt="user" />
          )}
          <div className="chat-content">
            <div className="markdown-container">
              {loading && content === "" ? (
                <Spinner />
              ) : role === "assistant" ? (
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {convertPlainTextLinks(content)}
                </Markdown>
              ) : (
                <div
                  className="plain-text"
                  dangerouslySetInnerHTML={{
                    __html: convertPlainTextLinks(content),
                  }}
                />
              )}
            </div>

            {error && (
              <Alert
                className="chat-error"
                message="Something went wrong. Try again"
                type="error"
                showIcon
                icon={<img src={errorIcon} alt="error" style={{ width: 20 }} />}
                action={
                  <Button
                    type="primary"
                    size="small"
                    onClick={() =>
                      submitNewMessage(messages[idx - 1].content, true)
                    }
                  >
                    Send again
                  </Button>
                }
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
