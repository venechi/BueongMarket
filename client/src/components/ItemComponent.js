import React from "react";
import "antd/dist/antd.css";
import { Row, Col, Image, Card } from "antd";

function ItemComponent(props) {
  return (
    <div
      style={{
        flex: "none",
        margin: "8px 4px",
        padding: "4px",
        border: "1px solid #40a9ff",
      }}
    >
      <Row>
        <Col flex="300px">
          <Image src={`/api/images/${props.item.id_code}/${props.item.id}/thumbnail.jpg`} />
        </Col>
        <Col flex="auto">
          <a href={`/item/${props.item.id}`}>
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
          </a>
        </Col>
      </Row>
      {/* --for mobile--
            <Card
            cover={<img src="thumbnail.jpg"/>}
            headStyle={{ fontWeight: "bolder", fontSize: "30px" }}
            bodyStyle={{ fontSize: "15px" }}
            style={{ width: "100%", height: "100%" }}
            title={props.item.title}
          >
            <div>{`가격: ${props.item.price}원`}</div>
            <div>{`🧭 ${props.item.loc}`}</div>
            <div>{`⏰ ${props.item.reg_date} ~ ${props.item.exp_date}`}</div>
          </Card> */}
    </div>
  );
}

export default ItemComponent;
