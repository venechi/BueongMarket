import axios from "axios";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import ItemComponent from "../ItemComponent";
import "antd/dist/antd.css";
import { Input } from "antd";
const { Search } = Input;

function LandingPage(props) {
  const [items, setitems] = useState({});

  useEffect(() => {
    axios.get("/api/").then(function (res) {
      setitems(res.data);
    });
  }, []);

  return (
    <div>
      <Search
        placeholder="주변 공구를 검색해보세요!"
        enterButton
        maxLength={30}
        size="large"
        allowClear
      />
      <br />
      <br />
      <div display="flex">
        {Object.entries(items).map((item) => (
          <ItemComponent item={item[1]} />
        ))}
      </div>
    </div>
  );
}

export default withRouter(LandingPage);
