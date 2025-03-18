import React, { useState, useEffect } from "react";
import { Tooltip, Spin } from "antd";
import "./suggestQuestion.css";
import { fetchSimilarQuestions } from "../../services/chatbot/aimeService";

const SuggestQuestion = ({ messages, onSelectSuggestion }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSuggestions([]);
    if (messages === "") return;
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const similar = await fetchSimilarQuestions(messages);
        if (similar.length > 0) setSuggestions(similar);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [messages]);

  return (
    <div className="suggest-question-container">
      {isLoading ? (
        <Spin size="medium" />
      ) : (
        suggestions.map((question, index) => {
          const isLong = question.length > 30;
          const displayText = isLong ? `${question.slice(0, 45)}...` : question;

          return (
            <Tooltip title={isLong ? question : null} key={index}>
              <button
                className="suggestion-btn"
                onClick={() => onSelectSuggestion(question)}
              >
                {displayText}
              </button>
            </Tooltip>
          );
        })
      )}
    </div>
  );
};

export default SuggestQuestion;
