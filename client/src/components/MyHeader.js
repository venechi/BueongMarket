import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";
import CONSTANTS from "./Constants";
import LoginStatusComponent from "./LoginStatusComponent";
const { Header, Content, Footer } = Layout;

function MyHeader(props) {
  const [size, setsize] = useState(window.innerWidth > 1200 ? "960px" : "80%");
  useEffect(() => {
    const calSize = () => {
      if (window.innerWidth > 1200 && size !== "960px") setsize("960px");
      else if (window.innerWidth <= 1200 && size !== "80%") setsize("80%");
    };

    window.addEventListener("resize", calSize);
    return () => {
      window.removeEventListener("resize", calSize);
    };
  }, [size]);

  return (
    <Layout>
      <Header>
        <a href="/">
          <div
            style={{
              paddingRight: "10px",
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
        <LoginStatusComponent />
      </Header>
      <Content>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "inline-block", width: size }}>
            {props.children}
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>{CONSTANTS.MARKET_NAME}</Footer>
    </Layout>
  );
}

export default MyHeader;
