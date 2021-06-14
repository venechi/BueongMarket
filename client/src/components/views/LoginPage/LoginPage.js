import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_actions";
import { withRouter } from "react-router-dom";
import { Input, Button, Form } from "antd";
import "antd/dist/antd.css";

function LoginPage(props) {
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  useEffect(() => {
    localStorage.clear();
  }, []);

  const setters = {
    email: setEmail,
    password: setPassword,
  };

  const onChangeHandler = (event) => {
    let func = setters[event.target.id];
    if (func) func(event.target.value);
  };

  const onSubminHandler = (values) => {
    dispatch(loginUser(values)).then((res) => {
      if (res.payload.loginSuccess) {
        localStorage.setItem("user", JSON.stringify(res.payload.user));
        props.history.push("/");
      } else alert("error");
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "60vh",
      }}
    >
      <div>
        <Form onFinish={onSubminHandler}>
          <Form.Item
            name="id"
            rules={[
              {
                required: true,
                type: "email",
                message: "ID는 이메일 형태여야 합니다.",
              },
            ]}
          >
            <Input
              placeholder="E-mail"
              id="email"
              value={Email}
              onChange={onChangeHandler}
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="pw"
            rules={[{ required: true, message: "비밀번호를 입력해 주세요" }]}
          >
            <Input.Password
              placeholder="Password"
              value={Password}
              id="password"
              onChange={onChangeHandler}
              allowClear
            />
          </Form.Item>

          <Form.Item>
            <Button style={{ width: "100%" }} type="primary" htmlType="submit">
              로그인
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" href="/register" style={{ width: "100%" }}>
              회원가입
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default withRouter(LoginPage);
