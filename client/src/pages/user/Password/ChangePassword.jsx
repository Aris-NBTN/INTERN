import React, { useState } from 'react'
import { Card, Col, Form, Input, Modal, Row, Typography } from 'antd'
import LayoutAdmin from '~/components/layout/Admin/Layout'

const HomePage = () => {
    const [formUser] = Form.useForm();
    const [formForgot] = Form.useForm();

    const [openForgot, setOpenForgot] = useState(false);

    const handlePutPassword = (values) => {
    }

    const handleResetPassword = (values) => {
    }

    return (
        <LayoutAdmin
            title='Đổi mật khẩu'
            header={'ĐỔI MẬT KHẨU'}
        >
            <Card
                className='h-full overflow-auto'
                title="Đổi mật khẩu"
            >
                <Form
                    form={formUser}
                    name="customForm"
                    layout="vertical"
                    onFinish={handlePutPassword}
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
                            <Typography.Link onClick={() => setOpenForgot(true)}>Quên mật khẩu ?</Typography.Link>
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
                </Form>
            </Card>

            <Modal
                title="Quên mật khẩu"
                centered
                open={openForgot}
                onOk={() => setOpenForgot(false)}
                onCancel={() => setOpenForgot(false)}
                width={1000}
            >
                <Form
                    form={formUser}
                    name="formForgot"
                    layout="vertical"
                    onFinish={handleResetPassword}
                >
                    <Form.Item
                        className='mb-2'
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Nhập email để lấy lại mật khẩu!' }]}
                    >
                        <Input.Password
                            size='large'
                            placeholder='Nhập mật khẩu cũ'
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </LayoutAdmin>
    )
}

export default HomePage