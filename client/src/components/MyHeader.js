import React from "react";
import { Layout, Menu } from "antd";
import "antd/dist/antd.css";
import CONSTANTS from "./Constants";
import LoginStatusComponent from "./LoginStatusComponent";
const { Header, Content, Footer } = Layout;

function MyHeader(props) {
  return (
    <Layout>
      <Header style={{ zIndex: 1, width: "100%" }}>
        <a href="/">
          <div
            style={{
              width: "250px",
              float: "left",
              color: "white",
              fontWeight: "bolder",
              fontSize: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              alt="logo"
              style={{
                width: "48px",
                height: "48px",
                fill: "white",
              }}
              src="/image/icon/logo.svg"
            />
            {CONSTANTS.MARKET_NAME}
          </div>
        </a>
        <LoginStatusComponent/>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">
            <a href="/">지역 공구</a>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <div style={{ marginTop: "64px" }}>{props.children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>{CONSTANTS.MARKET_NAME}</Footer>
    </Layout>
  );
}

export default MyHeader;
