import React from 'react'
import { Card, Col, Form, Input, Row, Select, Typography } from 'antd'
import { useNavigate } from 'react-router-dom';

import LayoutAdmin from '~/components/layout/Admin/Layout'

const HomePage = () => {
    const [formUser] = Form.useForm();
    const navigate = useNavigate();

    const handlePutPassword = (values) => {
    }

    return (
        <LayoutAdmin
            title='Đổi mật khẩu'
            header={'THAY ĐỔI MẬT KHẨU'}
        >
            <Form
                form={formUser}
                name="customForm"
                layout="vertical"
                onFinish={handlePutPassword}
            >
                <Row gutter={[18, 18]}>
                    <Col span={24}>
                        <Card
                            title="Đổi mật khẩu"
                        >
                            <Row gutter={[14, 14]}>
                                <Col span={14}>
                                    <Form.Item
                                        className='mb-2'
                                        name="oldPassword"
                                        label="Mật khẩu cũ"
                                        rules={[{ required: true, message: 'Nhập mật khẩu cũ!' }]}
                                    >
                                        <Input.Password
                                            size='large'
                                            placeholder='Nhập mật khẩu cũ'
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className='flex items-center mt-4' span={10}>
                                    <Typography.Link onClick={() => navigate('/user/forgot-password')}>Quên mật khẩu ?</Typography.Link>
                                </Col>
                                <Col span={14}>
                                    <Form.Item
                                        className='mb-2'
                                        name="newPassword"
                                        label="Mật khẩu mới"
                                        rules={[{ required: true, message: 'Nhập mật khẩu mới!' }]}
                                    >
                                        <Input.Password
                                            size='large'
                                            placeholder='Nhập mật khẩu mới'
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={14}>
                                    <Form.Item
                                        className='mb-2'
                                        name="newPassword"
                                        label="Xác nhận mật khẩu"
                                        rules={[{ required: true, message: 'Nhập lại mật khẩu mới!' }]}
                                    >
                                        <Input.Password
                                            size='large'
                                            placeholder='Nhập lại mật khẩu mới'
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </LayoutAdmin>
    )
}

export default HomePage