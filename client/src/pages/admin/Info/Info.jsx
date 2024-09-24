import { Button, Card, Input, Form, Col, Row, Space } from 'antd'
import { useEffect, useState } from 'react'

import LayoutAdmin from '~/components/layout/admin/Layout'
// import AntdUpload from '~/components/img/AntdImgUpload'
import { useMediaQuery } from 'react-responsive';
import { toastSuccess } from '~/components/toast';

import { infoApi } from '~/apis/infoApi';

const Website = () => {
    const [formInfo] = Form.useForm();

    const putInfo = async () => {
    };

    const fetchData = () => {
        infoApi.allInfo().then((res) => {
            console.log(res);
        })
    };

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <LayoutAdmin
            header='WEBSITE'
            button={
                <>
                    <Button type='primary' onClick={() => formInfo.submit}>
                        Lưu thông tin
                    </Button>
                </>
            }
        >
            <Form
                form={formInfo}
                className='w-full'
                name="customForm"
                layout="vertical"
                onFinish={putInfo}
            >

                <Row gutter={[18, 18]}>
                    <Col md={{ span: 12 }} span={24}>
                        <Card
                            className='h-full'
                            title='Thông tin webstie'
                        >
                            <Form.Item
                                className='mb-2'
                                name="name"
                                label="Tên Website"
                                rules={[{ required: true, message: 'Nhập tên Website!' }]}
                            >
                                <Input
                                    className='mb-2'
                                    placeholder="Nhập tên Website"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="manage"
                                label="Tên quản lý"
                                rules={[{ required: true, message: 'Nhập tên quản lý!' }]}
                            >
                                <Input
                                    className='mb-2'
                                    placeholder="Nhập tên quản lý"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="phone"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
                            >
                                <Input
                                    className='mb-2'
                                    placeholder="Nhập số điện thoại"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="address"
                                label="Địa chỉ"
                                rules={[{ required: true, message: 'Nhập địa chỉ!' }]}
                            >
                                <Input
                                    className='mb-2'
                                    placeholder="Nhập địa chỉ"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="email"
                                label="Email"
                                rules={[{ required: true, message: 'Nhập email!' }]}
                            >
                                <Input
                                    className='mb-2'
                                    placeholder="Nhập email"
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col md={{ span: 12 }} span={24}>
                        <Card
                            className='mb-5'
                            title='Thông tin Google'
                        >
                            <Form.Item
                                className='mb-2'
                                name="GoogleClient"
                                label="Quản lý đăng nhập google"
                                rules={[{ required: true, message: 'Nhập Google Client!' }]}
                            >
                                <Input
                                    className='mb-2'
                                    placeholder="Nhập Google Client"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-0'
                                name="GoogleTitle"
                                label="Quản lý gửi Email Google"
                                rules={[{ required: true, message: 'Nhập tiêu đề!' }]}
                            >
                                <Input
                                    className='mb-2'
                                    placeholder="Nhập tiêu đề"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-0'
                                name="GoogleEmail"
                                rules={[{ required: true, message: 'Nhập email!' }]}
                            >
                                <Input
                                    className='mb-2'
                                    placeholder="Nhập email"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-0'
                                name="GooglePassword"
                                rules={[{ required: true, message: 'Nhập mật khẩu!' }]}
                            >
                                <Input
                                    className='mb-2'
                                    placeholder="Nhập mật khẩu"
                                />
                            </Form.Item>
                        </Card>

                        <Card>
                            Ảnh google
                        </Card>
                    </Col>
                </Row>
            </Form>
        </LayoutAdmin>
    )
}

export default Website