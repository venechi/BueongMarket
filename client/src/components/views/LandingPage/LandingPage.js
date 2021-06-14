import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import ItemComponent from "../../ItemComponent";
import { getItems } from "../../../_actions/item_actions";
import "antd/dist/antd.css";
import { Input, Divider, Button, Empty, Radio } from "antd";
import CONSTANTS from "../../Constants";
import MyHeader from "../../MyHeader";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingComponent from "../../LoadingComponent";

const { Search } = Input;

function LandingPage(props) {
  const dispatch = useDispatch();
  const [searchQuery, setsearchQuery] = useState();
  const [count, setcount] = useState(0);
  const [items, setitems] = useState();
  const allItems = useRef();
  const [hasMore, sethasMore] = useState(true);
  const [selected, setselected] = useState(-1);
  const [isLoaded, setisLoaded] = useState(false);

  function getMore() {
    if (hasMore) {
      let nextCount = Math.min(count + 10, items.length);
      setcount(nextCount);
      if (nextCount === items.length) sethasMore(false);
    }
  }

  function init(newItems) {
    setitems(newItems);
    let nextCount = Math.min(newItems.length, 10);
    setcount(nextCount);
    sethasMore(nextCount === newItems.length ? false : true);
    setisLoaded(true);
  }

  function search(query) {
    dispatch(getItems(query)).then((res) => {
      setisLoaded(false);
      setsearchQuery(query);
      allItems.current = res.payload;
      init(res.payload.filter((item) => selected === -1 || item.item_class === selected));
    });
  }

  function handleRadio(e) {
    setisLoaded(false);
    setselected(e.target.value);
    init(allItems.current.filter((item) => e.target.value === -1 || item.item_class === e.target.value));
  }

  useEffect(() => {
    dispatch(getItems()).then((res) => {
      allItems.current = res.payload;
      init(res.payload);
    });
  }, [dispatch]);

  useEffect(() => {
    document.title = searchQuery
      ? `${CONSTANTS.MARKET_NAME} :: ${searchQuery}`
      : CONSTANTS.MARKET_NAME;
  }, [searchQuery]);

  if (isLoaded)
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
        <Divider orientation="left">
          {searchQuery ? `'${searchQuery}' 검색 결과` : "최근 등록된 공구"}
        </Divider>
        <Radio.Group
          onChange={handleRadio}
          value={selected}
        >
          <Radio value={-1}>전체 공구 보기</Radio>
          <Radio value={0}>내 지역 공구만 보기</Radio>
          <Radio value={1}>전국 공구만 보기</Radio>
        </Radio.Group>
        <div display="flex">
          {items.length !== 0 ? (
            <InfiniteScroll
              dataLength={count}
              next={getMore}
              hasMore={hasMore}
              loader={<LoadingComponent />}
            >
              {items.slice(0, count).map((item) => (
                <ItemComponent key={item.id} item={item} />
              ))}
            </InfiniteScroll>
          ) : (
            <Empty
              description={
                <span>
                  <div>등록된 공구가 없어요!</div>
                  <div>
                    하단의 새 공구 만들기 버튼을 눌러 공구를 등록해 보세요!
                  </div>
                </span>
              }
            />
          )}
        </div>
      </MyHeader>
    );
  else
    return (
      <MyHeader>
        <LoadingComponent />
      </MyHeader>
    );
}

export default withRouter(LandingPage);
