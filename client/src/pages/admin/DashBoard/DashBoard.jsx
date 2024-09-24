import { useEffect } from 'react'
import LayoutAdmin from '~/components/layout/Admin/Layout'
import { Avatar, Card, Col, Row, theme, Typography } from 'antd';
import { FaCartShopping, FaRegChartBar, FaEye, FaUser, FaArrowUp } from "react-icons/fa6";

import RevenueDay from '~/components/charts/RevenueDay';
import RevenueWeek from '~/components/charts/RevenueWeek';
import RevenueMonth from '~/components/charts/RevenueMonth';
import { FormatPrice } from '~/components/table/Format';
import { useDispatch, useSelector } from 'react-redux';
import { getRevenueApi } from '~/redux/slices/Data/revenueSlice';

const DashBoard = () => {
    const { token: { colorPrimary } } = theme.useToken();
    const dispatch = useDispatch();
    const { revenue, loading } = useSelector((state) => state.revenue);

    // Week
    const dailyRevenues = revenue?.revenue?.dailyRevenues || [];
    const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

    useEffect(() => {
        if (loading === true) {
            dispatch(getRevenueApi());
        }
    }, []);

    return (
        <LayoutAdmin header='TRANG CHỦ'>
            <Row gutter={[18, 18]} className='overflow-hidden'>
                <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }} >
                    <Card
                        loading={loading}
                        className='ant-card-pro'
                        title=
                        <>
                            <Typography.Title level={4} className='!mb-0'>Tổng Doanh Thu</Typography.Title>
                            <div className="me-3 absolute" style={{ top: "10px", right: "10px" }}>
                                <Avatar
                                    style={{
                                        backgroundColor: colorPrimary,
                                    }}
                                >
                                    <FaRegChartBar size={20} />
                                </Avatar>
                            </div>
                        </>
                        bordered={false}
                    >
                        <Typography.Title className='fw-bold' level={2}>{FormatPrice(revenue?.revenue?.totalRevenueAllTime)}</Typography.Title>
                        <Typography.Title level={5} className='!mb-0'>Tổng doanh thu tuần này</Typography.Title>
                        <div className="flex justify-between">
                            <Typography.Title level={4} type='danger' className='!my-2'>{FormatPrice(revenue?.revenue?.weeklyRevenue)}</Typography.Title>

                            <div className="flex items-center gap-2">
                                <Typography.Text className="flex items-center gap-2 !mt-0" type='success'>
                                    {revenue?.revenue?.revenueDifference > 0 ? (
                                        <> + {FormatPrice(revenue?.revenue?.revenueDifference)}</>
                                    ) : (<></>)}
                                    <FaArrowUp size={16} />
                                </Typography.Text>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }} >
                    <Card
                        loading={loading}
                        className='ant-card-pro'
                        title=
                        <>
                            <Typography.Title level={4} className='!mb-0'>Tổng Đơn Đặt Hàng</Typography.Title>
                            <h5 className='m-0'></h5>
                            <div className="me-3 absolute" style={{ top: "10px", right: "10px" }}>
                                <Avatar
                                    style={{
                                        backgroundColor: colorPrimary,
                                    }}
                                >
                                    <FaCartShopping size={20} />
                                </Avatar>
                            </div>
                        </>
                        bordered={false}
                    >
                        <Typography.Title className='fw-bold' level={2}>{revenue?.orders?.totalOrdersWithStatus} Đơn đặt hàng</Typography.Title>
                        <Typography.Title level={5} className='!mb-0'>Tổng đơn hàng tuần này</Typography.Title>
                        <div className="flex justify-between">
                            <Typography.Title level={4} type='danger' className='!my-2'>{revenue?.orders?.totalOrdersThisWeekWithStatus} Đơn</Typography.Title>
                            {revenue?.orders?.orderDifferenceWithStatus > 0 ? (
                                <>

                                    <div className="flex items-center gap-2">
                                        <Typography.Text className="flex items-center gap-2 !mt-0" type='success'>
                                            + {revenue?.orders?.orderDifferenceWithStatus} Đơn
                                            <FaArrowUp size={16} />
                                        </Typography.Text>
                                    </div>
                                </>
                            ) : (
                                <>

                                    <div className="flex items-center gap-2">
                                        <Typography.Text className="flex items-center gap-2 !mt-0" type='danger'>
                                            + 100.000 VNĐ
                                            <FaArrowUp size={16} />
                                        </Typography.Text>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </Col>

                <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }} >
                    <Card
                        loading={loading}
                        className='ant-card-pro'
                        title=
                        <>
                            <Typography.Title level={4} className='!mb-0'>Truy Cập Website</Typography.Title>
                            <h5 className='m-0'></h5>
                            <div className="me-3 absolute" style={{ top: "10px", right: "10px" }}>
                                <Avatar
                                    style={{
                                        backgroundColor: colorPrimary,
                                    }}
                                >
                                    <FaEye size={20} />
                                </Avatar>
                            </div>
                        </>
                        bordered={false}
                    >
                        <Typography.Title className='fw-bold' level={2}> --- </Typography.Title>
                        <Typography.Title level={5} className='!mb-0'>Tổng lượng truy cập tuần này</Typography.Title>
                        <div className="flex justify-between">
                            <Typography.Title level={4} type='danger' className='!my-2'> --- </Typography.Title>
                            <div className="flex items-center gap-2">
                                <Typography.Text className="flex items-center gap-2 !mt-0" type='success'>
                                    ---
                                    <FaArrowUp size={16} />
                                </Typography.Text>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }} >
                    <Card
                        loading={loading}
                        className='ant-card-pro'
                        title=
                        <>
                            <Typography.Title level={4} className='!mb-0'>Người Dùng</Typography.Title>
                            <div className="me-3 absolute" style={{ top: "10px", right: "10px" }}>
                                <Avatar
                                    style={{
                                        backgroundColor: colorPrimary,
                                    }}
                                >
                                    <FaUser size={20} />
                                </Avatar>
                            </div>
                        </>
                        bordered={false}
                    >
                        <Typography.Title className='fw-bold' level={2}>{revenue?.users?.totalUsersWithStatus} Người dùng</Typography.Title>
                        <Typography.Title level={5} className='!mb-0'>Tổng người dùng tuần này</Typography.Title>
                        <div className="flex justify-between">
                            <Typography.Title level={4} type='danger' className='!my-2'>{revenue?.users?.totalUsersThisWeek} Người dùng</Typography.Title>
                            {revenue?.users?.totalUsersThisWeek > 0 ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Typography.Text className="flex items-center gap-2 !mt-0" type='success'>
                                            + {revenue?.users?.userDifference}
                                            <FaArrowUp size={16} />
                                        </Typography.Text>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Typography.Text className="flex items-center gap-2 !mt-0" type='danger'>
                                            + {revenue?.users?.userDifference}
                                            <FaArrowUp size={16} />
                                        </Typography.Text>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </Col>

                <Col span={24} lg={{ span: 12 }}>
                    <Card loading={loading} title=<Typography.Title level={3} className='!mb-0'>Hôm Nay</Typography.Title> bordered={false} >
                        <div style={{ height: 500 }}>
                            <RevenueDay
                                data={[
                                    { value: revenue?.orders?.totalOrdersToday, name: 'Tổng đơn đặt hàng' },
                                    { value: revenue?.orders?.totalOrdersTodayWithFalseStatus, name: 'Tổng đơn đặt hàng chưa thanh toán' },
                                    { value: revenue?.orders?.totalOrdersTodayWithTrueStatus, name: 'Tổng đơn đặt hàng đã thanh toán' },
                                    // { value: 0, name: 'Lượng truy cập người dùng' },
                                ]}
                            />
                        </div>
                    </Card>
                </Col>

                <Col span={24} lg={{ span: 12 }}>
                    <Card
                        loading={loading}
                        title=<Typography.Title level={3} className='!mb-0'>Doanh Thu Theo Tuần</Typography.Title>
                        bordered={false}
                    >
                        <div style={{ height: 500 }}>
                            <RevenueWeek
                                data={dailyRevenues.map((dailyRevenue, index) => ({
                                    value: dailyRevenue.revenue,
                                    name: dayNames[index]
                                }))}
                            />
                        </div>
                    </Card>
                </Col>

                <Col span={24} >
                    <Card
                        loading={loading}
                        className='!mb-6'
                        title=<Typography.Title level={3} className='!mb-0'>Doanh Thu Hằng Tháng</Typography.Title>
                        bordered={false}
                    >
                        <RevenueMonth
                            data={revenue?.revenue?.monthlyRevenues.map(item => item.revenue)}
                        />
                    </Card>
                </Col>
            </Row>
        </LayoutAdmin>
    )
}

export default DashBoard