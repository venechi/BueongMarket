import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import { logout } from "../_actions/user_actions";
import "antd/dist/antd.css";

function LoginStatusComponent(props) {
  const [user, setuser] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    setuser(JSON.parse(localStorage.getItem("user")));
  }, [setuser]);

  const logoutHandler = () => {
    dispatch(logout()).then((res) => console.log(res));
    localStorage.clear();
    props.history.push("/");
  };

  if (user)
    return (
      <div
        style={{
          float: "right",
          color: "white",
        }}
      >
        <span>
          안녕하세요 <span style={{ color: "#1890ff" }}>{user.nickname}</span>{" "}
          님!
        </span>
        <span style={{ marginLeft: "10px", marginRight: "10px" }}>|</span>
        <Button shape="round" onClick={logoutHandler}>
          로그아웃
        </Button>
      </div>
    );
  else
    return (
      <div
        style={{
          float: "right",
          color: "white",
        }}
      >
        <Button shape="round" href="/login">
          로그인
        </Button>
      </div>
    );
}

export default withRouter(LoginStatusComponent);
