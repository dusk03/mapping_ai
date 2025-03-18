import React from "react";
import "./homepage.css";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h1 className="homepage-title">Welcome to Mapping AI</h1>
        <p className="homepage-description">
          Discover the power of artificial intelligence to transform your
          workflow. Our platform brings smart tools to help you work faster and
          smarter.
        </p>
        <button
          className="homepage-button"
          onClick={() => navigate("/sign-in")}
        >
          Getting Started
        </button>
      </div>
    </div>
  );
};

export default Homepage;
