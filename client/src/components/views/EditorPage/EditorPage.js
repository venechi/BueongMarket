import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router-dom";
import { Upload, Modal, Divider, Button, Form, Input, DatePicker } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import { useDispatch } from "react-redux";
import { getItem, updateItem } from "../../../_actions/item_actions";
import MyHeader from "../../MyHeader";
import LoadingComponent from "../../LoadingComponent";
import CONSTANTS from "../../Constants";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function EditorPage(props) {
  let { itemId } = useParams();
  const imgMaxCnt = 10;

  const dispatch = useDispatch();

  const [previewVisible, setpreviewVisible] = useState(false);
  const [previewImage, setpreviewImage] = useState("");
  const [previewTitle, setpreviewTitle] = useState("");
  const [fileList, setfileList] = useState([]);
  const [defaultValue, setdefaultValue] = useState({
    title: null,
    price: 0,
    exp_date: moment().add(7, "days"),
    content: null,
    isLoaded: false,
  });

  useEffect(() => {
    if (defaultValue.isLoaded === false) {
      if (itemId === "new") {
        setdefaultValue({ ...defaultValue, isLoaded: true });
      } else {
        dispatch(getItem(itemId)).then(function (res) {
          const user = JSON.parse(localStorage.getItem("user"));
          if (
            res.payload.isSuccess &&
            user.id_code === res.payload.item.id_code
          ) {
            const item = res.payload.item;
            const photos = res.payload.photoList;
            setfileList(
              photos.map((photo) => {
                return {
                  uid: photo.filename,
                  name: photo.filename,
                  status: "done",
                  url: `/api/images/${item.id_code}/${item.id}/${photo.filename}`,
                };
              })
            );
            setdefaultValue({
              title: item.title,
              price: item.price,
              exp_date: moment(item.exp_date),
              content: item.content,
              isLoaded: true,
            });
          } else return props.history.push("/");
        });
      }
    }
  }, [
    dispatch,
    itemId,
    props.history,
    setdefaultValue,
    setfileList,
    defaultValue,
  ]);

  const handleUpload = (values) => {
    const formData = new FormData();
    fileList.forEach((file) => formData.append("files", JSON.stringify(file)));
    values.exp_date = values.exp_date.format("YYYY-MM-DD hh:mm:ss");
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

  const disabledDateNTime = (current) => {
    return current & (current < moment());
  };

  //todo: 사진 업로드시 심각한 화질 열화 개선할 것.
  //todo: 사진 업로드시 중복되는 이름이 없는지 체크할 것.
  document.title = `${CONSTANTS.MARKET_NAME} :: 에디터 페이지`;
  if (!defaultValue.isLoaded) return <LoadingComponent />;
  else
    return (
      <MyHeader>
        <Divider orientation="center" style={{ marginBottom: "30px" }}>
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
        <Form
          onFinish={handleUpload}
          initialValues={{
            title: defaultValue.title,
            price: defaultValue.price,
            exp_date: defaultValue.exp_date,
            content: defaultValue.content,
          }}
        >
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
            <Input id="title" placeholder="제목" allowClear />
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
            <Input placeholder={0} allowClear />
          </Form.Item>
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
            <DatePicker
              showTime
              disabledDate={disabledDateNTime}
              disabledTime={disabledDateNTime}
            />
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
              {itemId === "new" ? "새 공구 게시" : "공구 업데이트"}
            </Button>
          </Form.Item>
        </Form>
      </MyHeader>
    );
}

export default withRouter(EditorPage);
