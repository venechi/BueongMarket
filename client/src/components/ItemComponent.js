import React, { Component } from "react";
import "antd/dist/antd.css";
import { Row, Col, Image, Card } from "antd";

export class ItemComponent extends Component {
  render() {
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
            {/* todo: 리소스 경로 수정 */}
            <Image src="/devResources/thumbnail.jpg" />
          </Col>
          <Col flex="auto">
            <a href={`/item/${this.props.item.id}`}>
              <Card
                headStyle={{ fontWeight: "bolder", fontSize: "30px" }}
                bodyStyle={{ fontSize: "15px" }}
                style={{ width: "100%", height: "100%" }}
                title={this.props.item.title}
              >
                <div>{`가격: ${this.props.item.price}원`}</div>
                <div>{`🧭 ${this.props.item.loc}`}</div>
                <div>{`⏰ ${this.props.item.reg_date} ~ ${this.props.item.exp_date}`}</div>
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
            title={this.props.item.title}
          >
            <div>{`가격: ${this.props.item.price}원`}</div>
            <div>{`🧭 ${this.props.item.loc}`}</div>
            <div>{`⏰ ${this.props.item.reg_date} ~ ${this.props.item.exp_date}`}</div>
          </Card> */}
      </div>
    );
  }
}

export default ItemComponent;
