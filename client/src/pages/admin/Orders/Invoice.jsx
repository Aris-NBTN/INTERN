import React from 'react'

import { FaUser, } from "react-icons/fa6";
import { FaPhoneAlt, FaAddressCard, FaPhone } from 'react-icons/fa';
import { MdMail } from "react-icons/md";

import './Invoice.css'
import { Col, Row, theme, Typography } from 'antd';
import { FormatDayTimeWithHour, FormatPrice } from '~/components/table/Format';

const Invoice = ({ info }) => {
    const { token: { colorPrimary } } = theme.useToken();
    return (
        <>
            <div className="invoice-wrapper">
                <div className="invoice">
                    <div className="invoice-container">
                        <div className="invoice-head">
                            <Row>
                                <Col md={{ span: 12 }} span={24}>
                                    <img className='h-20' src="https://pbs.twimg.com/profile_images/1701878932176351232/AlNU3WTK_400x400.jpg" />
                                </Col>

                                <Col className="flex justify-end items-center invoice-head-top-right text-end" md={{ span: 12 }} span={24}>
                                    <h3 className='!mb-0' style={{ color: colorPrimary }}>HÓA ĐƠN</h3>
                                </Col>
                            </Row>
                            <div className="hr !mb-1" />
                            <div className="invoice-head-middle">
                                <div className="invoice-head-middle-left text-start">
                                    <p className='!mb-0'><span className="text-bold">Ngày đặt hàng: </span>{FormatDayTimeWithHour(info.createdAt)}</p>
                                </div>
                                <div className="invoice-head-middle-right text-end">
                                    <p className='!mb-0'>
                                        <span className="text-bold">Mã Đơn Hàng: {info.orderId} </span>
                                    </p>
                                </div>
                            </div>
                            <div className="hr !mb-1" />

                            {info.status === true && (
                                <>
                                    <div className="invoice-head-middle">
                                        <div className="invoice-head-middle-left text-start">
                                            <p className='!mb-0'><span className="text-bold">Ngày thanh toán: </span>{FormatDayTimeWithHour(info.updatedAt)}</p>
                                        </div>
                                        <div className="invoice-head-middle-right text-end">
                                            <p className='!mb-0'>
                                                <span className="text-bold">Phương thức thanh toán: {info.orderId} </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hr !mb-1" />
                                </>
                            )}

                            <Row>
                                <Col md={{ span: 12 }} span={24}>
                                    <ul>
                                        <li className="text-bold">Người mua hàng:</li>
                                        <li className='flex items-center gap-2 !mb-1'> <FaUser /> {info.name}</li>
                                        <li className='flex items-center gap-2 !mb-1'> <FaPhoneAlt /> {info.phone}</li>
                                        <li className='flex items-center gap-2 !mb-1'> <MdMail /> {info.email}</li>
                                        <li className='flex items-center gap-2 !mb-1'> <FaAddressCard /> {info.address}</li>
                                    </ul>
                                </Col>

                                <Col md={{ span: 12 }} span={24}>
                                    <ul className="text-end">
                                        <li className="text-bold flex justify-end items-center">Người nhận:</li>
                                        <li className='flex justify-end items-center gap-2 !mb-1'>Chicken War Studio<FaUser /></li>
                                        <li className='flex justify-end items-center gap-2 !mb-1'>2705 <FaPhone /></li>
                                        <li className='flex justify-end items-center gap-2 !mb-1'>Orange, <MdMail /></li>
                                        <li className='flex justify-end items-center gap-2 !mb-1'>contact@koiceinc.com <FaAddressCard /></li>
                                    </ul>
                                </Col>
                            </Row>
                        </div>

                        <div className="overflow-view pt-2">
                            <div className="invoice-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <td className="text-bold">Mã Khóa Học</td>
                                            <td className="text-bold">Tên Khóa Học</td>
                                            <td className="text-bold">Giá Tiền</td>
                                        </tr>
                                    </thead>
                                    {
                                        info.product.map((item, index) => (
                                            <tbody key={index}>
                                                <tr>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td className="text-start">
                                                        <Typography.Text type='danger'>{FormatPrice(item.price)}</Typography.Text>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ))
                                    }
                                </table>
                                <div className="invoice-body-bottom">
                                    <div className="invoice-body-info-item">
                                        <div className="info-item-td text-end text-bold">Thành Tiền:</div>
                                        <Typography.Text strong type='danger' className="info-item-td text-end">1.200.000 VNĐ</Typography.Text>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="invoice-foot text-center">
                            <p><span className="text-bold text-center">NOTE:&nbsp;</span>This is computer generated receipt and does
                                not require physical signature.
                            </p>
                        </div>

                        <div className="invoice-foot text-center">
                            {info.status === true ? (
                                <Typography.Title level={5} className='!!mb-0' type='danger'>Đã thanh toán</Typography.Title>
                            ) : (
                                <Typography.Title level={5} className='!!mb-0' type='danger'>Chưa thanh toán</Typography.Title>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Invoice