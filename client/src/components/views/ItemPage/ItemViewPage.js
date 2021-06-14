import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router";
import { Carousel, Image, Button } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import LoadingComponent from "../../LoadingComponent";
import CONSTANTS from "../../Constants";
import MyHeader from "../../MyHeader";
import { useDispatch } from "react-redux";
import { getItem, deleteItem } from "../../../_actions/item_actions";

function ItemViewPage(props) {
  const size = "80vw";
  let { itemId } = useParams();
  const [user, setuser] = useState();
  const [itemInfo, setitemInfo] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    setuser(JSON.parse(localStorage.getItem("user")));
    dispatch(getItem(itemId)).then((res) => {
      if (res.payload.isSuccess) {
        setitemInfo(res.payload);
      } else return props.history.push("/");
    });
  }, [dispatch, itemId, props.history, setuser]);

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <Button
        className={className}
        style={{ ...style, display: "block" }}
        onClick={onClick}
        icon={<LeftOutlined style={{ color: "gray" }} />}
      />
    );
  }

  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <Button
        className={className}
        style={{ ...style, display: "block" }}
        onClick={onClick}
        icon={<RightOutlined style={{ color: "gray" }} />}
      />
    );
  }

  if (itemInfo) {
    document.title = `${CONSTANTS.MARKET_NAME} :: 상세페이지 - ${itemInfo.item.title}`;
    return (
      <MyHeader>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: size, display: "inline-block" }}>
            <Carousel
              arrows
              draggable
              prevArrow={<PrevArrow />}
              nextArrow={<NextArrow />}
            >
              {itemInfo.photoList.map((file) => (
                <div key={file.filename}>
                  <Image
                    src={`/api/images/${itemInfo.item.id_code}/${itemId}/${file.filename}`}
                    preview={false}
                    width={size}
                    height={size}
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-block",
                width: size,
                textAlign: "left",
              }}
            >
              <h1>{itemInfo.item.title}</h1>
              <div>{`가격: ${itemInfo.item.price}원`}</div>
              <div>{`🧭 ${itemInfo.item.loc}`}</div>
              <div>{`⏰ ${itemInfo.item.reg_date} ~ ${itemInfo.item.exp_date}`}</div>
              <p>{itemInfo.item.content}</p>
            </div>
          </div>
          {user ? (
            itemInfo.item.id_code === user.id_code ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: size, display: "flex" }}>
                  <span style={{ width: "50%", display: "inline-block" }}>
                    <Button type="primary" block href={`/editor/${itemId}`}>
                      수정
                    </Button>
                  </span>
                  <span style={{ width: "50%", display: "inline-block" }}>
                    <Button
                      type="primary"
                      block
                      danger
                      onClick={() => {
                        dispatch(deleteItem(itemId)).then((res) => {
                          if (res.payload.isDeleteSuccess)
                            return props.history.push("/");
                          else alert("알수 없는 에러");
                        });
                      }}
                    >
                      삭제
                    </Button>
                  </span>
                </div>
              </div>
            ) : null
          ) : null}
        </div>
      </MyHeader>
    );
  } else return <LoadingComponent />;
}

export default withRouter(ItemViewPage);
