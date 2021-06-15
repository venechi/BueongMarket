import { Divider, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getItemsOfUser } from "../../../_actions/item_actions";
import CONSTANTS from "../../../Constants";
import MyHeader from "../../MyHeader";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingComponent from "../../LoadingComponent";
import ItemComponent from "../../ItemComponent";
import "antd/dist/antd.css";

function MyPage() {
  const dispatch = useDispatch();
  const [count, setcount] = useState(0);
  const [items, setitems] = useState([]);
  const [hasMore, sethasMore] = useState(true);
  const [isLoaded, setisLoaded] = useState(false);

  function getMore() {
    if (hasMore) {
      let nextCount = Math.min(count + 10, items.length);
      setcount(nextCount);
      if(nextCount === items.length) sethasMore(false);
    }
  }

  useEffect(() => {
    document.title = `${CONSTANTS.MARKET_NAME} :: 마이페이지`;
    dispatch(getItemsOfUser()).then((res) => {
      setitems(res.payload);
      let nextCount = Math.min(res.payload.length, 10);
      setcount(nextCount);
      sethasMore(nextCount === res.payload.length ? false : true);
      setisLoaded(true);
    });
  }, [dispatch]);

  if (isLoaded)
    return (
      <MyHeader>
        <Divider dashed orientation="left">
          내가 만든 공구
        </Divider>
        {items.length === 0 ? (
          <Empty
            description={
              <span>
                <div>아직 공구를 만들지 않았어요.</div>
                <div>
                  <a href="/">홈 페이지</a>로 돌아가 새 공구를 만들어보세요!
                </div>
              </span>
            }
          />
        ) : (
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
        )}
      </MyHeader>
    );
  else
    return (
      <MyHeader>
        <LoadingComponent />
      </MyHeader>
    );
}

export default MyPage;
