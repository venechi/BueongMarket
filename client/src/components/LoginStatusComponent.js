import { Dropdown, Menu, Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import { logout } from "../_actions/user_actions";
import "antd/dist/antd.css";
import { UserOutlined } from "@ant-design/icons";

function LoginStatusComponent(props) {
  const [user, setuser] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    setuser(JSON.parse(localStorage.getItem("user")));
  }, [setuser]);

  const logoutHandler = () => {
    dispatch(logout()).then((res) => {
      localStorage.removeItem("user");
      props.history.push("/logout");
    });
  };

  const genOverlay = (user) => {
    if (user)
      return (
        <Menu>
          <Menu.Item>
            <div style={{ fontWeight: "bold" }}>{user.id}</div>
            <div style={{ textAlign: "right" }}>{`안녕하세요 ${user.nickname} 님!`}</div>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="a0" onClick={logoutHandler}>
            로그아웃
          </Menu.Item>
        </Menu>
      );
    else
      return (
        <Menu>
          <Menu.Item key="b0">
            <a href="/login">로그인</a>
          </Menu.Item>
        </Menu>
      );
  };

  return (
    <div
      style={{
        float: "right",
        color: "white",
      }}
    >
      <Dropdown overlay={genOverlay(user)} trigger={["click"]}>
        {user ? (
          <Avatar
            style={{ backgroundColor: "#1890ff", verticalAlign: "middle" }}
          >
            {user.nickname.charAt(0)}
          </Avatar>
        ) : (
          <Avatar
            style={{ backgroundColor: "#1890ff", verticalAlign: "middle" }}
            icon={<UserOutlined />}
          />
        )}
      </Dropdown>
    </div>
  );
}

export default withRouter(LoginStatusComponent);
