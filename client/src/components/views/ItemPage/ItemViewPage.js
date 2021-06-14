import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Carousel, Image, Button } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import LoadingComponent from "../../LoadingComponent";
import CONSTANTS from "../../Constants";

function ItemViewPage() {
  const size = "600px";
  let { itemId } = useParams();
  const [itemInfo, setitemInfo] = useState();
  useEffect(() => {
    axios.get(`/api/item/${itemId}`).then((res) => {
      setitemInfo(res.data);
    });
  }, [itemId]);

  
  if (itemInfo) {
    document.title = `${CONSTANTS.MARKET_NAME} - ${itemInfo.item.title} :: 상세페이지`
    return (
      <div style={{ textAlign: "center", marginTop:"100px"}}>
        <div style={{ width: size, display: "inline-block" }}>
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
                  lineHeight={size}
                  width={size}
                  height={size}
                />
              </div>
            ))}
          </Carousel>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ display: "inline-block", width: size, textAlign: "left" }}
          >
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
        </div>
      </div>
    );
  } else return <LoadingComponent />;
}

export default ItemViewPage;
