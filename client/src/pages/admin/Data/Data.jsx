import { Button, Card, Col, Row, Typography } from 'antd'
import React from 'react'
import LayoutAdmin from '~/components/layout/Admin/Layout'

const Data = () => {
    return (
        <LayoutAdmin header={'DATA'}>
            <Row gutter={[18, 18]}>
                <Col span={24}>
                    <Card>
                        <div className="flex justify-between items-center">
                            <Typography.Title level={5} className='!mb-0'>Sao lưu tất cả dữ liệu</Typography.Title>
                            <Button>Tải dữ liệu về</Button>
                        </div>
                    </Card>
                </Col>

                <Col lg={{ span: 8 }} md={{ span: 12 }} span='24'>
                    <Card>
                        <div className="flex justify-between items-center">
                            <Typography.Title level={5} className='!mb-0'>Khôi phục dữ liệu website</Typography.Title>
                            <Button>Tải lên file</Button>
                        </div>
                    </Card>
                </Col>

                <Col lg={{ span: 8 }} md={{ span: 12 }} span='24'>
                    <Card>
                        <div className="flex justify-between items-center">
                            <Typography.Title level={5} className='!mb-0'>Khôi phục dữ liệu bài viết</Typography.Title>
                            <Button>Tải lên file</Button>
                        </div>
                    </Card>
                </Col>

                <Col lg={{ span: 8 }} md={{ span: 12 }} span='24'>
                    <Card>
                        <div className="flex justify-between items-center">
                            <Typography.Title level={5} className='!mb-0'>Khôi phục dữ liệu bố cục</Typography.Title>
                            <Button>Tải lên file</Button>
                        </div>
                    </Card>
                </Col>

                <Col lg={{ span: 8 }} md={{ span: 12 }} span='24'>
                    <Card>
                        <div className="flex justify-between items-center">
                            <Typography.Title level={5} className='!mb-0'>Khôi phục dữ liệu menu</Typography.Title>
                            <Button>Tải lên file</Button>
                        </div>
                    </Card>
                </Col>

                <Col lg={{ span: 8 }} md={{ span: 12 }} span='24'>
                    <Card>
                        <div className="flex justify-between items-center">
                            <Typography.Title level={5} className='!mb-0'>Khôi phục dữ liệu người dùng</Typography.Title>
                            <Button>Tải lên file</Button>
                        </div>
                    </Card>
                </Col>

                <Col lg={{ span: 8 }} md={{ span: 12 }} span='24'>
                    <Card>
                        <div className="flex justify-between items-center">
                            <Typography.Title level={5} className='!mb-0'>Khôi phục dữ liệu khóa học</Typography.Title>
                            <Button>Tải lên file</Button>
                        </div>
                    </Card>
                </Col>

                <Col lg={{ span: 8 }} md={{ span: 12 }} span='24'>
                    <Card>
                        <div className="flex justify-between items-center">
                            <Typography.Title level={5} className='!mb-0'>Khôi phục dữ liệu đơn hàng</Typography.Title>
                            <Button>Tải lên file</Button>
                        </div>
                    </Card>
                </Col>

                <Col lg={{ span: 8 }} md={{ span: 12 }} span='24'>
                    <Card>
                        <div className="flex justify-between items-center">
                            <Typography.Title level={5} className='!mb-0'>Khôi phục dữ liệu plugins</Typography.Title>
                            <Button>Tải lên file</Button>
                        </div>
                    </Card>
                </Col>

                <Col lg={{ span: 8 }} md={{ span: 12 }} span='24'>
                    <Card>
                        <div className="flex justify-between items-center">
                            <Typography.Title level={5} className='!mb-0'>Khôi phục dữ liệu key thanh toán</Typography.Title>
                            <Button>Tải lên file</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </LayoutAdmin>
    )
}

export default Data