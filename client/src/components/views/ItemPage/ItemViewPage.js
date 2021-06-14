import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Carousel, Spin, Image, Button } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

function ItemViewPage() {
  let { itemId } = useParams();
  const [itemInfo, setitemInfo] = useState();
  useEffect(() => {
    axios.get(`/api/item/${itemId}`).then((res) => {
      setitemInfo(res.data);
    });
  }, []);

  if (itemInfo) {
    console.log(itemInfo.item);
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "500px", display: "inline-block" }}>
          <Carousel
            arrows
            draggable
            prevArrow={
              <Button icon={<LeftOutlined style={{ color: "gray" }} />} />
            }
            nextArrow={
              <Button icon={<RightOutlined style={{ color: "gray" }} />} />
            }
          >
            {itemInfo.photoList.map((file) => (
              <div>
                <Image
                  src={`/devResources/${file.filename}`}
                  preview={false}
                  lineHeight="500px"
                  width="500px"
                  height="500px"
                />
              </div>
            ))}
          </Carousel>
        </div>
        <h1>{itemInfo.item.title}</h1>
        <p>
          <div>{`가격: ${itemInfo.item.price}원`}</div>
          <div>{`🧭 ${itemInfo.item.loc}`}</div>
          <div>{`⏰ ${itemInfo.item.reg_date} ~ ${itemInfo.item.exp_date}`}</div>
        </p>
        <p>
          <div>{itemInfo.item.content}</div>
        </p>
      </div>
    );
  } else
    return (
      <div style={{ "text-align": "center", padding: "50px" }}>
        <Spin tip="Loading..."></Spin>
      </div>
    );
}

export default ItemViewPage;
