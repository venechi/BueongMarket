import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import ItemComponent from "../../ItemComponent";
import { getItems } from "../../../_actions/item_actions";
import "antd/dist/antd.css";
import { Input, Divider, Button } from "antd";
import CONSTANTS from "../../Constants";
import MyHeader from "../../MyHeader";
const { Search } = Input;

function LandingPage(props) {
  const dispatch = useDispatch();
  const [items, setitems] = useState({});
  const [searchQuery, setsearchQuery] = useState();

  const search = useCallback(
    (query) => {
      dispatch(getItems(query)).then((res) => {
        setitems(res.payload);
        setsearchQuery(query);
      });
    },
    [dispatch]
  );

  useEffect(() => {
    search();
  }, [dispatch, search]);

  document.title = searchQuery
    ? `${CONSTANTS.MARKET_NAME} :: ${searchQuery}`
    : CONSTANTS.MARKET_NAME;

  return (
    <MyHeader>
      <Search
        placeholder="주변 공구를 검색해보세요!"
        enterButton
        maxLength={30}
        size="large"
        allowClear
        onSearch={(query) => {
          if (query === "") query = undefined;
          search(query);
        }}
        style={{ paddingBottom: "30px" }}
      />
      <div style={{ float: "right", paddingRight: "15px" }}>
        <Button type="primary" shape="round" href="/editor/new">
          + 새 공구 만들기
        </Button>
      </div>
      <Divider
        orientation="left"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        {searchQuery ? `'${searchQuery}' 검색 결과` : "최근 등록된 공구"}
      </Divider>
      <div display="flex">
        {Object.entries(items).map((item) => (
          <ItemComponent key={item[1].id} item={item[1]} />
        ))}
      </div>
    </MyHeader>
  );
}

export default withRouter(LandingPage);
