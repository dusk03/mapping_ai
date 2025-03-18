import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./verifyPage.css"; // Import file CSS
import { API_BASE } from "../../config";

const VerifyAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your account...");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${API_BASE}/auth/verify/${token}`);
        setMessage(response.data.message);

        setTimeout(() => setStatus("success"), 3000);

        setTimeout(() => navigate("/sign-in"), 6000);
      } catch (error) {
        setMessage("Verification failed. Please try again.");
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="verify-container">
      <div className={`verify-box ${status}`}>
        <h2>{status === "loading" ? "Please wait..." : message}</h2>
        {status === "success" && <p>Redirecting to login page...</p>}
      </div>
    </div>
  );
};

export default VerifyAccount;
