import React from "react";
import "antd/dist/antd.css";
import { Image, Card, Tag } from "antd";
import { isMobile, isTablet } from "react-device-detect";
import CONSTANTS from "../Constants";

function ItemComponent(props) {
  const title = (
    <span>
      {props.item.item_class === 0 ? (
        <Tag color="#87d068">지역</Tag>
      ) : (
        <Tag color="#2db7f5">전국</Tag>
      )}
      {props.item.title}
    </span>
  );

  const content = (
    <span>
      <div>{`가격: ${props.item.price}원`}</div>
      <div>{`🧭 ${props.item.loc}`}</div>
      <div>{`⏰ ${props.item.reg_date} ~ ${props.item.exp_date}`}</div>
    </span>
  );

  const forMobile = (
    <Card
      cover={
        <Image
          src={
            CONSTANTS.API_SERVER +
            `/api/images/${props.item.id_code}/${props.item.id}/thumbnail/thumbnail.jpg`
          }
          preview={false}
          onError={(e) => {
            e.target.src =
              CONSTANTS.API_SERVER +
              "/api/images/default/error/300px-No_image_available.svg.webp";
          }}
        />
      }
      headStyle={{ fontWeight: "bolder", fontSize: "25px" }}
      bodyStyle={{ fontSize: "15px" }}
      title={title}
    >
      {content}
    </Card>
  );

  const forDesktop = (
    <div style={{ display: "flex" }}>
      <Image
        src={
          CONSTANTS.API_SERVER +
          `/api/images/${props.item.id_code}/${props.item.id}/thumbnail/thumbnail.jpg`
        }
        preview={false}
        width={"300px"}
        height={"300px"}
        onError={(e) => {
          e.target.src =
            CONSTANTS.API_SERVER +
            "/api/images/default/error/300px-No_image_available.svg.webp";
        }}
      />
      <Card
        headStyle={{ fontWeight: "bolder", fontSize: "25px" }}
        bodyStyle={{ fontSize: "15px" }}
        style={{ width: "calc(100% - 300px)", height: "300px" }}
        title={title}
      >
        {content}
      </Card>
    </div>
  );

  return (
    <div
      style={{
        flex: "none",
        margin: "8px 4px",
        padding: "4px",
        border: "1px solid #40a9ff",
      }}
    >
      <a href={`/item/${props.item.id}`}>
        {!isTablet && isMobile ? forMobile : forDesktop}
      </a>
    </div>
  );
}

export default ItemComponent;
