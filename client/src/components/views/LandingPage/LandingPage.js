import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import ItemComponent from "../../ItemComponent";
import { getItems } from "../../../_actions/item_actions";
import "antd/dist/antd.css";
import { Input, Divider, Button, Empty } from "antd";
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
      />
      <div
        style={{
          zIndex: "1",
          position: "fixed",
          bottom: "8vh",
          right: "3vw",
          paddingRight: "15px",
        }}
      >
        <Button type="primary" shape="round" href="/editor/new">
          + 새 공구 만들기
        </Button>
      </div>
      <Divider orientation="left" style={{ paddingBottom: "10px" }}>
        {searchQuery ? `'${searchQuery}' 검색 결과` : "최근 등록된 공구"}
      </Divider>
      <div display="flex">
        {Object.keys(items).length !== 0 ? (
          Object.entries(items).map((item) => (
            <ItemComponent key={item[1].id} item={item[1]} />
          ))
        ) : (
          <Empty
            description={
              <span>
                <div>등록된 공구가 없어요!</div>
                <div>하단의 새 공구 만들기 버튼을 눌러 공구를 등록해 보세요!</div>
              </span>
            }
          />
        )}
      </div>
    </MyHeader>
  );
}

export default withRouter(LandingPage);
