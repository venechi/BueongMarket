import React from "react";
import { Spin } from "antd";
import "antd/dist/antd.css";

function LoadingComponent() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <Spin tip="Loading..."></Spin>
    </div>
  );
}

export default LoadingComponent;
