import React from "react";
import "antd/dist/antd.css";
import { Row, Col, Image, Card } from "antd";
import { isMobile, isTablet } from "react-device-detect";

function ItemComponent(props) {
  const forMobile = (
    <Card
      cover={
        <Image
          src={`/api/images/${props.item.id_code}/${props.item.id}/thumbnail/thumbnail.jpg`}
          preview={false}
          onError={(e) => {
            e.target.src =
              "/api/images/default/error/300px-No_image_available.svg.webp";
          }}
        />
      }
      headStyle={{ fontWeight: "bolder", fontSize: "30px" }}
      bodyStyle={{ fontSize: "15px" }}
      title={props.item.title}
    >
      <div>{`가격: ${props.item.price}원`}</div>
      <div>{`🧭 ${props.item.loc}`}</div>
      <div>{`⏰ ${props.item.reg_date} ~ ${props.item.exp_date}`}</div>
    </Card>
  );

  const forDesktop = (
    <Row>
      <Col flex="300px">
        <Image
          src={`/api/images/${props.item.id_code}/${props.item.id}/thumbnail/thumbnail.jpg`}
          preview={false}
          onError={(e) => {
            e.target.src =
              "/api/images/default/error/300px-No_image_available.svg.webp";
          }}
        />
      </Col>
      <Col flex="auto">
        <Card
          headStyle={{ fontWeight: "bolder", fontSize: "30px" }}
          bodyStyle={{ fontSize: "15px" }}
          style={{ width: "100%", height: "100%" }}
          title={props.item.title}
        >
          <div>{`가격: ${props.item.price}원`}</div>
          <div>{`🧭 ${props.item.loc}`}</div>
          <div>{`⏰ ${props.item.reg_date} ~ ${props.item.exp_date}`}</div>
        </Card>
      </Col>
    </Row>
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
