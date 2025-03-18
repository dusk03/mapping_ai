import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./verifyAccount.css";

const VerifyAccount = () => {
  const navigate = useNavigate();

  return (
    <div className="verify-account-container">
      <div className="verify-card">
        <h2>Verify Your Account</h2>
        <p>
          We have sent a verification email to your inbox. Please check your
          email and follow the instructions to verify your account.
        </p>

        <Button type="primary" onClick={() => navigate("/sign-in")}>
          Go to Sign In
        </Button>
      </div>
    </div>
  );
};

export default VerifyAccount;
