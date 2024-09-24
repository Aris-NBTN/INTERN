import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Collapse, Divider, Modal, Progress, Row, Skeleton, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom';

import Layout from '~/components/layout/Public/Layout';

import Video from '~/components/video/Video';
import { toastError, toastSuccess } from '~/components/toast';

import { FaFile } from "react-icons/fa6";
import { FaBars, FaCheckCircle, FaInfinity, FaRegStar, FaStar } from 'react-icons/fa'
import { PiVideoFill } from "react-icons/pi";
import { IoPhonePortrait } from "react-icons/io5";
import { AiFillEdit } from "react-icons/ai";

import { courseApi } from '~/apis/courseApi';
import { FormatPrice } from '~/components/table/Format';

import './Course.css'
import { addToCart } from '~/redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { baseURL } from '~/utils';

const Crouses = () => {
  const slug = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({})
  const [video, setVideo] = useState(false)
  const [loading, setLoading] = useState(true)

  const user = useSelector((state) => state.auth.user);
  const isPurchased = user?.courses?.some((course) => course === data._id);

  const fetchData = () => {
    courseApi.sig(slug.slug)
      .then(res => {
        setData(res);
        setLoading(false)
      })
      .catch(() => {
        navigate('/courses')
        toastError('', 'Không tìm thấy khóa học!', 'Vui lòng thử lại sau!')
      })
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <Layout
      ldJson={data?.seo || {}}
      title={`${data?.name || 'Chicken War Studio'}`}>
      <section>
        <Row gutter={[18, 18]}>
          <Col
            xl={{ span: 17, order: 2 }}
            lg={{ span: 15, order: 2 }}
            md={{ span: 14, order: 1 }}
            span={24}
            xs={{ order: 2 }}
          >
            <Row gutter={[18, 18]}>
              <Col span={24}>
                <Card loading={loading} hoverable>
                  <Card.Meta
                    className="mb-3"
                    title={
                      <Typography.Title className="mb-0" level={3}>
                        {data?.name}
                      </Typography.Title>
                    }
                    description={`${data?.title || "Chưa có thông tin"}`}
                  />
                  <Card className="my-2">
                    <Card.Meta
                      title="Lợi ích từ khóa học"
                      description={
                        <Row>
                          {data?.benefit?.length > 0 ? (
                            <>
                              {data.benefit.map((item, index) => (
                                <div key={index}>
                                  <Col
                                    key={index}
                                    className="flex items-center gap-2 my-1"
                                  >
                                    <FaCheckCircle color="ffc000" />
                                    <Typography.Text>{item}</Typography.Text>
                                  </Col>
                                </div>
                              ))}
                              <img
                                className="card-image"
                                src={`${baseURL}/asset/course/couresData.png`}
                                alt="Mô tả ảnh"
                              />
                            </>
                          ) : (
                            <Typography.Text>
                              Chưa có thông tin
                            </Typography.Text>
                          )}
                        </Row>
                      }
                    />
                  </Card>

                  <Card.Meta
                    title={
                      <Typography.Title className="mt-2 mb-0" level={3}>
                        Giới thiệu khóa học
                      </Typography.Title>
                    }
                    description=<>
                      <Typography.Text>{data?.description || "Chưa có thông tin"}</Typography.Text>
                    </>
                  />
                </Card>
              </Col>

              <Col span={24}>
                <Card loading={loading} hoverable>
                  <Card.Meta
                    className="mb-2"
                    title={
                      <Typography.Title className="mb-2" level={3}>
                        Yêu cầu khóa học
                      </Typography.Title>
                    }
                    description={
                      <>
                        <div className="mt-2">
                          {data?.prerequisite?.length > 0 ? (
                            data.prerequisite.map((item, index) => (
                              <div
                                key={index}
                                className="col-12 flex items-center gap-2 my-1"
                              >
                                <FaCheckCircle color="ffc000" />
                                <Typography.Text>{item}</Typography.Text>
                              </div>
                            ))
                          ) : (
                            <Typography.Text>
                              Chưa có thông tin
                            </Typography.Text>
                          )}
                        </div>
                      </>
                    }
                  />
                </Card>
              </Col>

              <Col span={24}>
                <Card loading={loading} hoverable>
                  <Card.Meta
                    className="mb-2"
                    title={
                      <Typography.Title className="mb-2" level={3}>
                        Khóa học này phù hợp với
                      </Typography.Title>
                    }
                    description={
                      <>
                        {data?.customer?.length > 0 ? (
                          data.customer.map((item, index) => (
                            <div
                              key={index}
                              className="col-12 flex items-center gap-2 my-1"
                            >
                              <FaCheckCircle color="ffc000" />
                              <Typography.Text>{item}</Typography.Text>
                            </div>
                          ))
                        ) : (
                          <Typography.Text>Chưa có thông tin</Typography.Text>
                        )}
                      </>
                    }
                  />
                </Card>
              </Col>

              <Col span={24}>
                <Card loading={loading} hoverable>
                  <Card.Meta
                    className="!mb-2"
                    title={
                      <Typography.Title className="mb-2" level={3}>
                        Nội dung khóa học
                      </Typography.Title>
                    }
                    description="4 Phần, 22 Bài học"
                  />
                  <Collapse
                    items={[
                      {
                        key: "1",
                        label: "Giới Thiệu",
                        children: (
                          <>
                            <div className="flex items-center gap-2">
                              <PiVideoFill color="ffc000" size={22} />
                              <Typography.Text>

                                Giới thiệu khóa học
                              </Typography.Text>
                              <Button
                                className="ms-auto"
                                type="primary"
                                onClick={() => setVideo(true)}
                              >
                                Xem thử
                              </Button>
                            </div>
                          </>
                        ),
                      },
                    ]}
                    defaultActiveKey={["1"]}
                  />
                </Card>
              </Col>

              <Col span={24}>
                <Card loading={loading} hoverable>
                  <Card.Meta
                    className="mb-2"
                    title={
                      <Typography.Title className="!mb-2" level={3}>
                        Đánh giá từ học viên
                      </Typography.Title>
                    }
                  />
                  <Row gutter={[12, 12]}>
                    <Col
                      className="flex flex-col justify-center"
                      md={{ span: 6 }}
                      span={24}
                    >
                      <Typography.Title
                        level={1}
                        style={{ color: "#ffc000" }}
                        className="text-center !mb-0"
                      >
                        4.9
                      </Typography.Title>
                      <div
                        className="evaluate flex justify-center gap-1"
                        style={{ color: "#ffc000", fontSize: 18 }}
                      >
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>
                      <Typography.Text className="text-center fs-6">
                        Đánh giá khóa học
                      </Typography.Text>
                    </Col>

                    <Col md={{ span: 18 }} span={24}>
                      <div className="flex gap-2">
                        <Progress
                          className="mb-2"
                          percent={90}
                          status="active"
                          percentPosition={{
                            align: "center",
                            type: "inner",
                          }}
                          size={["100%", 22]}
                          strokeColor={{
                            from: "#F6E96B",
                            to: "#ffc000",
                          }}
                        />

                        <div
                          className="evaluate flex justify-center gap-1"
                          style={{ color: "#ffc000", fontSize: 18 }}
                        >
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Progress
                          className="mb-2"
                          percent={9}
                          percentPosition={{
                            align: "center",
                            type: "inner",
                          }}
                          size={["100%", 22]}
                          strokeColor={{
                            from: "#F6E96B",
                            to: "#ffc000",
                          }}
                        />

                        <div
                          className="evaluate flex justify-center gap-1"
                          style={{ color: "#ffc000", fontSize: 18 }}
                        >
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaRegStar />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Progress
                          className="mb-2"
                          percent={1}
                          percentPosition={{
                            align: "center",
                            type: "inner",
                          }}
                          size={["100%", 22]}
                          strokeColor={{
                            from: "#F6E96B",
                            to: "#ffc000",
                          }}
                        />

                        <div
                          className="evaluate flex justify-center gap-1"
                          style={{ color: "#ffc000", fontSize: 18 }}
                        >
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaRegStar />
                          <FaRegStar />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Progress
                          className="mb-2"
                          percent={0}
                          percentPosition={{
                            align: "center",
                            type: "inner",
                          }}
                          size={["100%", 22]}
                          strokeColor={{
                            from: "#F6E96B",
                            to: "#ffc000",
                          }}
                        />

                        <div
                          className="evaluate flex justify-center gap-1"
                          style={{ color: "#ffc000", fontSize: 18 }}
                        >
                          <FaStar />
                          <FaStar />
                          <FaRegStar />
                          <FaRegStar />
                          <FaRegStar />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Progress
                          className="mb-2"
                          percent={0}
                          percentPosition={{
                            align: "center",
                            type: "inner",
                          }}
                          size={["100%", 22]}
                          strokeColor={{
                            from: "#F6E96B",
                            to: "#ffc000",
                          }}
                        />

                        <div
                          className="evaluate flex justify-center gap-1"
                          style={{ color: "#ffc000", fontSize: 18 }}
                        >
                          <FaStar />
                          <FaRegStar />
                          <FaRegStar />
                          <FaRegStar />
                          <FaRegStar />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>

          <Col
            xl={{ span: 7, order: 2 }}
            lg={{ span: 9, order: 2 }}
            md={{ span: 10, order: 2 }}
            span={24}
            xs={{ order: 1 }}
          >
            <Card
              loading={loading}
              className="sticky card-course"
              style={{ top: "3rem" }}
              hoverable
              cover={
                <>
                  {loading ? (
                    <Skeleton.Image
                      className="!w-full"
                      active={true}
                      style={{ height: "15rem" }}
                    />
                  ) : (
                    <div className="px-5 pt-5">
                      <img
                        className="rounded-md"
                        style={{ height: "15rem", objectFit: "cover" }}
                        src={data.imgDetail ? `${baseURL}/uploads/${data.imgDetail}` : `${baseURL}/asset/course/empty.png`}
                        alt=""
                      />
                    </div>
                  )}
                </>
              }
            >
              <Row gutter={[12, 12]}>
                <Divider
                  style={{ margin: "0px 0", borderColor: "rgb(173 173 173)" }}
                >
                  Khóa học bao gồm
                </Divider>
                <Col span={12} className="flex items-center gap-2">
                  <FaBars size={18} /> Chuyên mục : 4
                </Col>
                <Col span={12} className="flex items-center gap-2">
                  <PiVideoFill size={20} /> Bài học: 42
                </Col>
                <Col span={12} className="flex items-center gap-2">
                  <AiFillEdit size={20} /> Bài tập
                </Col>
                <Col span={12} className="flex items-center gap-2">
                  <FaFile size={20} /> Tài liệu
                </Col>
                <Col span={12} className="flex items-center gap-2">
                  <FaInfinity size={20} /> Dễ hiểu
                </Col>
                <Col span={12} className="flex items-center gap-2">
                  <FaInfinity size={20} /> Học trọn đời
                </Col>
                <Col span={24} className="flex items-center gap-2">
                  <IoPhonePortrait size={22} /> Học trên mọi thiết bị có
                  internet
                </Col>

                {isPurchased || data.price === 0 ? (
                  <>
                    <Col span={24}>
                      <Divider
                        style={{
                          margin: "10px 0",
                          borderColor: "rgb(173 173 173)",
                        }}
                      >
                      </Divider>
                      {
                        user.userType === "user" ? (
                          <Button size='large' type='primary' onClick={() => navigate(`/user/course/${data.slug}`)} className='w-full'>Học ngay</Button>
                        ) : (
                          <Button size='large' className='w-full' onClick={() => navigate("/login", { state: { from: `/user/course/${data.slug}` } })}>Đăng nhập để học</Button>
                        )
                      }
                    </Col>
                  </>
                ) : (
                  <>
                    <Col span={24}>
                      <Divider
                        style={{
                          margin: "10px 0",
                          borderColor: "rgb(173 173 173)",
                        }}
                      >
                        Giá khóa học
                      </Divider>

                      <div className="flex justify-center items-center gap-3 fs-3 text-center text-danger">
                        <Typography.Title
                          className="!mb-0"
                          type="danger"
                          level={3}
                        >
                          {FormatPrice(data.price * (1 - data.sale / 100))}
                        </Typography.Title>

                        {data.sale > 0 && (
                          <>
                            <Typography.Text className="!mb-0" delete>
                              {FormatPrice(data.price)}
                            </Typography.Text>
                            <span className="sale">{data.sale}%</span>
                          </>
                        )}
                      </div>
                    </Col>

                    <Col span={24}>
                      <Divider
                        style={{
                          margin: "10px 0",
                          borderColor: "rgb(173 173 173)",
                        }}
                      ></Divider>
                      <div className="flex flex-col">
                        <Button
                          type='primary'
                          className="mb-2"
                          onClick={() => {
                            dispatch(addToCart(data));
                            navigate('/checkout')
                          }}
                          size="large"
                        >
                          Mua ngay
                        </Button>

                        <Button
                          size="large"
                          onClick={() => {
                            dispatch(addToCart(data));
                            toastSuccess(
                              data.name,
                              "Thêm vào giỏ hàng thành công",
                              `Đã thêm ${data.name} vào giỏ hàng`
                            );
                          }}
                        >
                          Thêm vào giỏ hàng
                        </Button>
                      </div>
                    </Col>
                  </>
                )}
              </Row>
            </Card>
          </Col>
        </Row>
      </section>

      <Modal
        centered
        open={video}
        onOk={() => setVideo(false)}
        onCancel={() => setVideo(false)}
        width={1000}
        footer={null}
        closeIcon={null}
        className="mb-2"
      >
        <Video src="https://www.w3schools.com/html/mov_bbb.mp4" />
      </Modal>
    </Layout>
  );
}

export default Crouses