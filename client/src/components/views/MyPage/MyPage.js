import { Divider, Empty } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getItemsOfUser } from "../../../_actions/item_actions";
import CONSTANTS from "../../Constants";
import MyHeader from "../../MyHeader";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingComponent from "../../LoadingComponent";
import ItemComponent from "../../ItemComponent";
import "antd/dist/antd.css";

function MyPage() {
  document.title = `${CONSTANTS.MARKET_NAME} :: 마이페이지`;
  const dispatch = useDispatch();
  const [count, setcount] = useState(0);
  const [items, setitems] = useState([]);
  const [hasMore, sethasMore] = useState(true);

  const getMore = useCallback(() => {
    if (hasMore) {
      if (items.length > count) setcount(Math.min(count + 10, items.length));
      else sethasMore(false);
    }
  }, [hasMore, items.length, count]);

  useEffect(() => {
    dispatch(getItemsOfUser()).then((res) => {
      setitems(res.payload);
      getMore();
    });
  }, [dispatch, getMore]);

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
}

export default MyPage;
