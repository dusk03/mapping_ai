import React, { useState, useContext } from "react";
import { Form, Input, Button, Alert } from "antd";
import axios from "axios";
import "./signInPage.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { API_BASE } from "../../config";

const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onFinish = async (values) => {
    setLoading(true);
    setFormError("");

    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: values.email,
        password: values.password,
      });

      const { access_token, refresh_token, resolution } = response.data;
      login(access_token, refresh_token);

      const decodedToken = jwtDecode(access_token);
      const userRole = decodedToken.user.role;

      if (resolution) {
        message.info(resolution);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        const errorMessage =
          data?.message || data?.detail || "Login failed. Please try again.";
        setFormError(`${errorMessage}`);
      } else if (!error.response) {
        setFormError(
          "No response from server. Check your internet connection."
        );
      } else {
        setFormError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-in-page">
      <div className="sign-in-wrapper">
        <h1 className="sign-in-title">Sign In</h1>
        <Form
          name="sign-in"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input size="large" className="full-width-input" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              minLength={7}
              size="large"
              className="full-width-input"
            />
          </Form.Item>

          {formError && (
            <Form.Item>
              <Alert type="error" message={formError} showIcon />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="submit-button"
            >
              Sign In
            </Button>
            <div className="to-sign-up">
              You don't have an account?{" "}
              <Link to="/sign-up" style={{ color: "#1890ff" }}>
                Sign up
              </Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignInPage;
