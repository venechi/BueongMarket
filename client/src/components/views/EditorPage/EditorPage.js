import React, { useState } from "react";
import { useParams, withRouter } from "react-router-dom";
import { Upload, Modal, Divider, Button, Form, Input, DatePicker } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import { useDispatch } from "react-redux";
import { updateItem } from "../../../_actions/item_actions";
import MyHeader from "../../MyHeader"

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

//todo: 수정시 기존 데이터 불러오는 루틴 추가
function EditorPage(props) {
  let { itemId } = useParams();
  const imgMaxCnt = 10;

  const dispatch = useDispatch();
  let date = new Date();

  const [previewVisible, setpreviewVisible] = useState(false);
  const [previewImage, setpreviewImage] = useState("");
  const [previewTitle, setpreviewTitle] = useState("");
  const [fileList, setfileList] = useState([]);
  const [title, settitle] = useState("");
  const [price, setprice] = useState(0);
  const [expDate, setexpDate] = useState(
    moment(date.setDate(date.getDate() + 7))
  );

  const handleUpload = (values) => {
    const formData = new FormData();
    fileList.forEach((file) => formData.append("files", JSON.stringify(file)));
    values.exp_date = expDate.format('YYYY-MM-DD hh:mm:ss');
    values.itemID = itemId;
    formData.append("item", JSON.stringify(values));

    dispatch(updateItem(formData)).then((res) => {
      if (res.payload.isUpdateSuccess) {
        props.history.push(`/item/${res.payload.itemId}`);
      } else alert("알 수 없는 에러");
    });
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setpreviewImage(file.url || file.preview);
    setpreviewVisible(true);
    setpreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList }) => {
    setfileList(fileList);
  };

  const handleCancel = () => {
    setpreviewVisible(false);
  };

  const onPriceChangeHandler = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) {
      setprice(0);
    } else setprice(value);
  };

  const onTitleChangeHandler = (event) => {
    settitle(event.target.value);
  };

  const onDateChange = (value, dateString) => {
    setexpDate(moment(dateString));
  };

  return (
    <MyHeader>
      <Divider
        orientation="center"
        style={{ marginBottom: "30px" }}
      >
        {itemId === "new" ? "새 공구 작성" : "공구 수정"}
      </Divider>
      <Divider
        dashed
        orientation="left"
      >{`사진 업로드 (${fileList.length}/${imgMaxCnt})`}</Divider>
      <Upload
        name="files"
        accept="image/*"
        action="/api/uploads"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple
        maxCount={imgMaxCnt}
        withCredentials
        beforeUpload={(file) => {
          setfileList(fileList.concat(file));
          return false; // 파일 선택시 바로 업로드 하지 않고 후에 한꺼번에 전송하기 위함
        }}
      >
        {fileList.length < imgMaxCnt ? "+ Upload" : null}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
      <Divider dashed orientation="left">
        내용 작성
      </Divider>
      <Form onFinish={handleUpload}>
        <label>제목</label>
        <Form.Item
          name="title"
          rules={[
            {
              required: true,
              message: "공구 제목을 입력해 주세요!",
            },
          ]}
        >
          <Input
            id="title"
            value={title}
            placeholder="제목"
            onChange={onTitleChangeHandler}
            allowClear
          />
        </Form.Item>
        <label>가격</label>
        <Form.Item
          name="price"
          rules={[
            {
              required: true,
              message: "가격을 입력해 주세요!",
            },
          ]}
        >
          <Input
            value={price}
            placeholder={0}
            onChange={onPriceChangeHandler}
            allowClear
          />
        </Form.Item>
        {/* todo: 현재시간보다 이전시간 선택할 경우 처리 */}
        <label>게시종료일시</label>
        <Form.Item
          name="exp_date"
          rules={[
            {
              required: true,
              message: "종료일시를 지정해 주세요!",
            },
          ]}
        >
          <DatePicker showTime onChange={onDateChange} value={expDate} />
        </Form.Item>
        <label>공구 설명</label>
        <Form.Item
          name="content"
          rules={[
            {
              required: true,
              message: "내용을 입력해 주세요!",
            },
          ]}
        >
          <TextArea rows={10} />
        </Form.Item>
        <Form.Item>
          <Button style={{ width: "100%" }} type="primary" htmlType="submit">
            새 공구 게시
          </Button>
        </Form.Item>
      </Form>
    </MyHeader>
  );
}

export default withRouter(EditorPage);
