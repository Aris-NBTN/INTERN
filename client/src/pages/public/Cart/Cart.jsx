import { useEffect, useState, lazy, Suspense } from 'react'
import { Typography, Divider, Empty, Row, Col, Spin, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { FormatPrice } from '~/components/table/Format';
import Layout from "~/components/layout/Public/Layout";

import './Cart.css'
import { IoIosLink } from "react-icons/io";
import { getCourseOutstandApi } from '~/redux/slices/Data/coursesOutstandSlice';
import ListLoading from '~/components/cart/ListLoading';
import ListCart from '~/components/cart/ListCart';
import useCartData from '~/hooks/Cart';

const CardCourse = lazy(() => import('~/components/course/CardCourse'));

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token: { colorPrimary } } = theme.useToken();
  const { outstand, loading: loadingOutstand } = useSelector((state) => state.outstand);
  const user = useSelector((state) => state.auth?.user);
  const { carts, estimated, total, discountedTotal, loading } = useCartData();

  useEffect(() => {
    if (loadingOutstand) {
      dispatch(getCourseOutstandApi())
    }
  }, []);

  return (
    <Layout title='Giỏ hàng'>
      <section>
        <Row gutter={[22, 22]}>
          <Col xl={{ span: 16 }} lg={{ span: 14 }} md={{ span: 24, order: 1 }} span={24} xs={{ order: 2 }}>
            <div className="w-full">
              <div className="flex justify-between items-center">
                <Typography.Title level={4}>
                  Khóa học nổi bật
                </Typography.Title>
                <Typography.Link
                  href="/courses"
                  className="flex gap-1 items-center"
                >
                  Xem thêm <IoIosLink size={20} />
                </Typography.Link>
              </div>

              <Row gutter={[12, 12]}>
                {loadingOutstand ? (
                  <Spin></Spin>
                ) : (
                  <>
                    {outstand.map(
                      (course, index) =>
                        course.status !== "Chưa bán" && (
                          <Col
                            key={index}
                            sm={{ span: 12 }}
                            md={{ span: 12 }}
                            lg={{ span: 12 }}
                            xl={{ span: 8 }}
                            span={24}
                          >
                            <Suspense fallback={<div>Loading...</div>}>
                              <CardCourse
                                openList={false}
                                ellipsisRow={1}
                                loading={loadingOutstand}
                                info={course}
                              />
                            </Suspense>
                          </Col>
                        )
                    )}
                  </>
                )}
              </Row>
            </div>
          </Col>

          <Col xl={{ span: 8 }} lg={{ span: 10 }} md={{ span: 24 }} order={2} span={24} xs={{ order: 1 }}>
            <div className="app-right sticky top-24">
              <div className="app-right-content">
                <ul className="product-list">
                  {loading ? (
                    <ListLoading active={true} quantity={4} />
                  ) : (
                    <>
                      {carts.length === 0 ? (
                        <Empty />
                      ) : (
                        <ListCart
                          carts={carts}
                        />
                      )}
                    </>
                  )}
                </ul>
              </div>

              <div style={{ padding: 15, marginTop: "auto" }}>
                <div className="product-details fadeIn">
                  <div className="product-details-line">
                    <Typography.Title className="!my-0" level={5}>
                      Tạm tính
                    </Typography.Title>
                    <Typography.Title className="!my-0" level={5}>
                      {FormatPrice(estimated)}
                    </Typography.Title>
                  </div>
                  <div className="product-details-line">
                    <Typography.Title className="!my-0" level={5}>
                      Giảm giá
                    </Typography.Title>
                    <Typography.Title className="!my-0" level={5}>
                      {FormatPrice(discountedTotal)}
                    </Typography.Title>
                  </div>
                  <Divider className="m-0"></Divider>
                  <div className="product-details-summary !pt-1">
                    <Typography.Title className="!my-0" level={4}>
                      Tổng cộng
                    </Typography.Title>
                    <Typography.Title
                      className="my-0"
                      type="danger"
                      level={4}
                    >
                      {FormatPrice(total)}
                    </Typography.Title>
                  </div>
                </div>
              </div>

              {carts.length === 0 ? (
                <button className="checkout-button"> Chưa có sản phẩm!</button>
              ) : (
                user.userType === "user" ? (
                  <>
                    <button
                      className="checkout-button"
                      onClick={() => navigate("/checkout")}
                    >
                      Tiến Hành Thanh Toán
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="checkout-button"
                      style={{ backgroundColor: colorPrimary }}
                      onClick={() => navigate("/login", { state: { from: "/checkout" } })}
                    >
                      Đăng nhập để tiếp tục
                    </button>
                  </>
                )
              )}

            </div>
          </Col>
        </Row>
      </section>
    </Layout>
  );
}

export default Cart