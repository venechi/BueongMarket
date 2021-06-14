import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import ItemComponent from "../../ItemComponent";
import { getItems } from "../../../_actions/item_actions";
import "antd/dist/antd.css";
import { Input, Divider } from "antd";
import CONSTANTS from "../../Constants";
const { Search } = Input;

function LandingPage(props) {
  const dispatch = useDispatch();
  const [items, setitems] = useState({});
  const [searchQuery, setsearchQuery] = useState();

  const search = useCallback((query) => {
    dispatch(getItems(query)).then((res) => {
      setitems(res.payload);
      setsearchQuery(query);
    });
  }, [dispatch]);

  useEffect(() => {
    search();
  }, [dispatch, search]);

  document.title = searchQuery
    ? `${CONSTANTS.MARKET_NAME} :: ${searchQuery}`
    : CONSTANTS.MARKET_NAME;

  return (
    <div>
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
        style={{ paddingTop: "30px" }}
      />
      <Divider
        orientation="left"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        {searchQuery ? `'${searchQuery}' 검색 결과` : "최근 등록된 공구"}
      </Divider>
      <div display="flex">
        {Object.entries(items).map((item) => (
          <ItemComponent item={item[1]} />
        ))}
      </div>
    </div>
  );
}

export default withRouter(LandingPage);
