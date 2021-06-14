import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router";
import {
  Carousel,
  Image,
  Button,
  Tag,
  Comment,
  Avatar,
  Form,
  Input,
} from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import LoadingComponent from "../../LoadingComponent";
import CONSTANTS from "../../Constants";
import MyHeader from "../../MyHeader";
import { useDispatch } from "react-redux";
import {
  getItem,
  deleteItem,
  updateComment,
} from "../../../_actions/item_actions";
import { isMobile } from "react-device-detect";
import moment from "moment";
const { TextArea } = Input;

function ItemViewPage(props) {
  let { itemId } = useParams();
  const [user, setuser] = useState();
  const [itemInfo, setitemInfo] = useState();
  const [submitting, setsubmitting] = useState(false);
  const [editingReply, seteditingReply] = useState(false);
  const [validateForComment, setvalidateForComment] = useState("success");
  const [validateForReply, setvalidateForReply] = useState("success");
  const dispatch = useDispatch();
  useEffect(() => {
    setuser(JSON.parse(localStorage.getItem("user")));
    dispatch(getItem(itemId)).then((res) => {
      if (res.payload.isSuccess) {
        setitemInfo(res.payload);
      } else return props.history.push("/");
    });
  }, [dispatch, itemId, props.history, setuser]);

  useEffect(() => {
    if (itemInfo)
      document.title = `${CONSTANTS.MARKET_NAME} :: 상세페이지 - ${itemInfo.item.title}`;
  }, [itemInfo]);

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

  function Editor({ onSubmit, submitting, parent_id, validateStatus }) {
    return (
      <Comment
        avatar={
          <Avatar
            style={{
              backgroundColor: "#1890ff",
              verticalAlign: "middle",
            }}
          >
            {user.nickname.charAt(0)}
          </Avatar>
        }
        content={
          <Form onFinish={onSubmit} initialValues={{ parent_id }}>
            <Form.Item hidden name="parent_id">
              <Input type="text" />
            </Form.Item>
            <Form.Item
              name="comment"
              validateStatus={validateStatus}
              onClick={() => {
                parent_id
                  ? setvalidateForReply("success")
                  : setvalidateForComment("success");
              }}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" disabled={submitting} type="primary">
                {parent_id ? "답글 달기" : "댓글 등록"}
              </Button>
              {parent_id ? (
                <Button
                  style={{ marginLeft: "5px" }}
                  type="primary"
                  danger
                  onClick={() => {
                    seteditingReply(false);
                    let newItemInfo = { ...itemInfo };
                    newItemInfo.comments = newItemInfo.comments.map(
                      (comment) => {
                        comment.reply = false;
                        return comment;
                      }
                    );
                  }}
                >
                  취소
                </Button>
              ) : null}
            </Form.Item>
          </Form>
        }
      />
    );
  }

  function handleSubmit(values) {
    setsubmitting(true);
    values.item_id = itemId;
    if (!values.comment || values.comment === "") {
      values.parent_id
        ? setvalidateForReply("error")
        : setvalidateForComment("error");
      setsubmitting(false);
      return;
    }
    dispatch(updateComment(values)).then((res) => {
      if (res.payload.isSuccess) {
        window.location.reload();
      } else {
        setsubmitting(false);
        alert("알 수 없는 에러");
      }
    });
  }

  if (itemInfo) {
    let isAuther = false;
    if (user) isAuther = itemInfo.item.id_code === user.id_code;
    let comments = itemInfo.comments.filter(
      (comment) => comment.parent_id === null
    );
    let replyComments = itemInfo.comments.filter(
      (comment) => comment.parent_id
    );
    comments.sort((a, b) => moment(a.reg_date) > moment(b.reg_date));
    replyComments.sort((a, b) => moment(a.reg_date) > moment(b.reg_date));
    return (
      <MyHeader>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "100%", display: "inline-block" }}>
            <div
              style={{ display: "flex", alignItems: "start", padding: "5px" }}
            >
              {itemInfo.item.item_class === 0 ? (
                <Tag color="#87d068">지역</Tag>
              ) : (
                <Tag color="#2db7f5">전국</Tag>
              )}
            </div>
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
                    preview={isMobile ? true : false}
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-block",
                width: "100%",
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
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "inline-block",
                width: "100%",
                textAlign: "left",
              }}
            >
              {user ? (
                editingReply ? null : (
                  <Editor
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    validateStatus={validateForComment}
                  />
                )
              ) : (
                <div>댓글을 작성하려면 로그인하십시오.</div>
              )}
              {comments.map((comment) => (
                <Comment
                  key={comment.comment_id}
                  actions={
                    user && !editingReply
                      ? [
                          <span
                            key={`reply-${comment.comment_id}`}
                            onClick={(e) => {
                              let newItemInfo = { ...itemInfo };
                              newItemInfo.comments[
                                itemInfo.comments.findIndex(
                                  (e) => e.comment_id === comment.comment_id
                                )
                              ].reply = true;
                              seteditingReply(true);
                              setitemInfo(newItemInfo);
                            }}
                          >
                            답글달기
                          </span>,
                        ]
                      : null
                  }
                  author={
                    itemInfo.item.id_code === comment.id_code ? (
                      <div>
                        {comment.nickname + " "}
                        <Tag color="gold">글쓴이</Tag>
                      </div>
                    ) : (
                      comment.nickname
                    )
                  }
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: "#1890ff",
                        verticalAlign: "middle",
                      }}
                    >
                      {comment.nickname.charAt(0)}
                    </Avatar>
                  }
                  content={comment.content}
                  datetime={comment.reg_date}
                >
                  {replyComments
                    .filter((reply) => reply.parent_id === comment.comment_id)
                    .map((reply) => (
                      <Comment
                        key={reply.comment_id}
                        author={
                          itemInfo.item.id_code === reply.id_code ? (
                            <div>
                              {reply.nickname + " "}
                              <Tag color="gold">글쓴이</Tag>
                            </div>
                          ) : (
                            reply.nickname
                          )
                        }
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor: "#1890ff",
                              verticalAlign: "middle",
                            }}
                          >
                            {reply.nickname.charAt(0)}
                          </Avatar>
                        }
                        content={reply.content}
                        datetime={reply.reg_date}
                      />
                    ))}
                  {comment.reply ? (
                    <Editor
                      onSubmit={handleSubmit}
                      submitting={submitting}
                      parent_id={comment.comment_id}
                      validateStatus={validateForReply}
                    />
                  ) : null}
                </Comment>
              ))}
            </div>
          </div>
          {user && isAuther ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "100%", display: "flex" }}>
                <span style={{ width: "50%", display: "inline-block" }}>
                  <Button
                    type="primary"
                    block
                    disabled={submitting}
                    href={`/editor/${itemId}`}
                  >
                    수정
                  </Button>
                </span>
                <span style={{ width: "50%", display: "inline-block" }}>
                  <Button
                    type="primary"
                    block
                    danger
                    disabled={submitting}
                    onClick={() => {
                      setsubmitting(true);
                      dispatch(deleteItem(itemId)).then((res) => {
                        if (res.payload.isDeleteSuccess)
                          return props.history.push("/");
                        else {
                          alert("알수 없는 에러");
                          setsubmitting(false);
                        }
                      });
                    }}
                  >
                    삭제
                  </Button>
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </MyHeader>
    );
  } else return <LoadingComponent />;
}

export default withRouter(ItemViewPage);
