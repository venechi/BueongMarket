import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { Input, Button, Form } from "antd";
import "antd/dist/antd.css";
import {
  registerUser,
  checkID,
  checkNickname,
} from "../../../_actions/user_actions";
import MyHeader from "../../MyHeader";
import CONSTANTS from "../../Constants";

function RegisterPage(props) {
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Name, setName] = useState("");
  const [NickName, setNickName] = useState("");
  const [IsPWMatched, setIsPWMatched] = useState(true);
  const [IsVaildID, setIsVaildID] = useState();
  const [IsVaildNickname, setIsVaildNickname] = useState();

  const setters = {
    password: setPassword,
    confirmPassword: setConfirmPassword,
    name: setName,
  };

  const onChangeHandler = (event) => {
    let func = setters[event.target.id];
    if (func) func(event.target.value);
  };

  const onEmailChangeHandler = (event) => {
    setEmail(event.target.value);
    setIsVaildID(undefined);
  };

  const onNicknameChangeHandler = (event) => {
    setNickName(event.target.value);
    setIsVaildNickname(undefined);
  };

  const onSubminHandler = (values) => {
    setIsPWMatched(values.pw === values.confirmPW);

    if (values.pw === values.confirmPW && IsVaildID && IsVaildNickname) {
      dispatch(registerUser(values)).then((res) => {
        if (res.payload.registerSuccess) props.history.push("/login");
        else alert("internal server error");
      });
    }
  };

  const onCheckID = () => {
    dispatch(checkID({ email: Email })).then((res) => {
      setIsVaildID(res.payload.isVaildID);
    });
  };

  const onCheckNickname = () => {
    dispatch(checkNickname({ nickname: NickName })).then((res) => {
      setIsVaildNickname(res.payload.isVaildNickname);
    });
  };

  document.title = `${CONSTANTS.MARKET_NAME} :: 회원가입`;
  return (
    <MyHeader>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "80vh",
        }}
      >
        <div>
          <Form onFinish={onSubminHandler}>
            <label>이메일</label>
            <Form.Item
              name="id"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "ID는 이메일 형태여야 합니다.",
                },
              ]}
              validateStatus={
                IsVaildID === undefined ? null : IsVaildID ? "success" : "error"
              }
              help={
                IsVaildID === undefined
                  ? null
                  : IsVaildID
                  ? "사용 가능한 이메일입니다"
                  : "이미 사용중인 이메일입니다"
              }
            >
              <Input
                type="email"
                id="email"
                value={Email}
                placeholder="E-mail"
                onChange={onEmailChangeHandler}
                allowClear
                addonAfter={
                  <Button type="primary" size="small" onClick={onCheckID}>
                    중복 확인
                  </Button>
                }
              />
            </Form.Item>

            <label>비밀번호</label>
            <Form.Item
              name="pw"
              rules={[{ required: true, message: "비밀번호를 입력해 주세요" }]}
              validateStatus={IsPWMatched ? "success" : "error"}
              help={IsPWMatched ? null : "비밀번호가 다릅니다"}
            >
              <Input.Password
                placeholder="Password"
                value={Password}
                id="password"
                onChange={onChangeHandler}
                allowClear
              />
            </Form.Item>

            <label>비밀번호 확인</label>
            <Form.Item
              name="confirmPW"
              rules={[
                { required: true, message: "비밀번호를 한번 더 입력해 주세요" },
              ]}
              validateStatus={IsPWMatched ? "success" : "error"}
              help={IsPWMatched ? null : "비밀번호가 다릅니다"}
            >
              <Input.Password
                placeholder="Confirm Password"
                value={ConfirmPassword}
                id="confirmPassword"
                onChange={onChangeHandler}
                allowClear
              />
            </Form.Item>

            <label>이름</label>
            <Form.Item
              name="name"
              rules={[{ required: true, message: "이름을 입력해 주세요" }]}
            >
              <Input
                id="name"
                value={Name}
                placeholder="name"
                onChange={onChangeHandler}
                allowClear
              />
            </Form.Item>

            <label>별명</label>
            <Form.Item
              name="nickname"
              rules={[{ required: true, message: "별명을 입력해 주세요" }]}
              validateStatus={
                IsVaildNickname === undefined
                  ? null
                  : IsVaildNickname
                  ? "success"
                  : "error"
              }
              help={
                IsVaildNickname === undefined
                  ? null
                  : IsVaildNickname
                  ? "사용 가능한 별명입니다"
                  : "이미 사용중인 별명입니다"
              }
            >
              <Input
                id="nickName"
                value={NickName}
                placeholder="Nickname"
                onChange={onNicknameChangeHandler}
                allowClear
                addonAfter={
                  <Button type="primary" size="small" onClick={onCheckNickname}>
                    중복 확인
                  </Button>
                }
              />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
              >
                회원가입
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </MyHeader>
  );
}

export default withRouter(RegisterPage);
