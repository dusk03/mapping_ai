import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./signUpPage.css";
import { API_BASE } from "../../config";

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/signup`, {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        username: values.username,
        password: values.password,
      });

      if (response.status === 201) {
        message.success("Sign up successfully");
        setTimeout(() => navigate("/verify"), 1500);
      }
    } catch (error) {
      message.error("Sign up failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-wrapper">
        <h1 className="sign-up-title">Sign Up</h1>
        <Form
          requiredMark={false}
          name="sign-up"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="middle"
        >
          {/* Username */}
          <Form.Item
            label="User name"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input className="full-width-input" />
          </Form.Item>

          {/* First Name & Last Name */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First name"
                name="first_name"
                rules={[
                  { required: true, message: "Please enter your first name!" },
                ]}
              >
                <Input className="full-width-input" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last name"
                name="last_name"
                rules={[
                  { required: true, message: "Please enter your last name!" },
                ]}
              >
                <Input className="full-width-input" />
              </Form.Item>
            </Col>
          </Row>

          {/* Email */}
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
            <Input className="full-width-input" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password className="full-width-input" />
          </Form.Item>

          {/* Agree Checkbox */}
          <Form.Item
            name="agree"
            valuePropName="checked"
            rules={[
              {
                required: true,
                message: "You must agree to the terms & conditions!",
              },
            ]}
          >
            <Checkbox>I agree to the Terms & Conditions</Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignUpPage;
