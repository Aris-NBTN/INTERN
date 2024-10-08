import React, { useEffect } from 'react'
import { Button, Card, Col, Form, Input, Radio, Row, Select } from 'antd'
import { useSelector } from 'react-redux';

import LayoutAdmin from '~/components/layout/Admin/Layout'
import UploadAvatar from '~/components/upload/UploadAvatar';
import { userApi } from '~/apis/userApi';

const HomePage = () => {
    const [formUser] = Form.useForm();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user?._id) {
            formUser.setFieldsValue(user);
        }
    }, [user]);

    const handlePutUser = (data) => {
        data.id = user._id;
        userApi
            .putUser(data)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <LayoutAdmin
            title='Thông tin cá nhân'
            header={'THÔNG TIN'}
            button={<>
                <Button type="primary" onClick={() => formUser.submit()}>Lưu Thông Tin</Button>
            </>}
        >
            <Form
                form={formUser}
                name="customForm"
                layout="vertical"
                onFinish={handlePutUser}
            >
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Card
                            title="Thông tin tài khoản"
                        >
                            <Row gutter={[14, 14]}>
                                <Form.Item
                                    className='mb-0 hidden'
                                    label="Email"
                                    name='_id'
                                >
                                    <Input
                                        size='large'
                                        readOnly
                                        placeholder='Nhập tên người dùng'
                                    />
                                </Form.Item>

                                <Col md={{ span: 12 }} span={24}>
                                    <Form.Item
                                        className='mb-0'
                                        label="Email"
                                        name='email'
                                    >
                                        <Input
                                            size='large'
                                            readOnly
                                            placeholder='Nhập tên người dùng'
                                        />
                                    </Form.Item>
                                </Col>

                                <Col md={{ span: 12 }} span={24}>
                                    <Form.Item
                                        className='mb-0'
                                        label="Số điện thoại"
                                        name="phone"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                    >
                                        <Input
                                            size='large'
                                            placeholder='Nhập số điện thoại'
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card
                            className='mb-6'
                            title="Thông tin cá nhân"
                        >
                            <Row gutter={[14, 14]}>
                                <Col xl={{ span: 20 }} md={{ span: 20 }} span={24}>
                                    <Form.Item
                                        name='name'
                                        label="Tên người dùng"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                                    >
                                        <Input
                                            size='large'

                                            placeholder='Nhập tên người dùng'
                                        />
                                    </Form.Item>
                                </Col>

                                <Col className='flex' xl={{ span: 4 }} md={{ span: 4 }} span={24}>
                                    <Form.Item
                                        name='gender'
                                        label="Giới tính"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                                    >
                                        <Radio.Group>
                                            <Radio value={'Nam'}>Nam</Radio>
                                            <Radio value={"Nữ"}>Nữ</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>

                                {/* <Col md={{ span: 8 }} span={24}>
                                            <Form.Item
                                                className='mb-2'
                                                name="province"
                                                label="Tỉnh/Thành phố"
                                                rules={[{ required: true, message: 'Chọn tỉnh hoặc thành phố!' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    optionFilterProp="label"
                                                    size='large'
                                                    className='mb-2'
                                                    placeholder='Chọn tỉnh hoặc thành phố'
                                                // options={province?.map(item => ({ label: item.province_name, value: item.province_id, key: item.province_name }))}
                                                >
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col md={{ span: 8 }} span={24}>
                                            <Form.Item
                                                className='mb-2'
                                                name="district"
                                                label="Quận/Huyện"
                                                rules={[{ required: true, message: 'Chọn quận hoặc huyện!' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    optionFilterProp="label"
                                                    size='large'
                                                    className='mb-2'
                                                    placeholder='Chọn quận hoặc huyện'
                                                // options={district?.map(item => ({ label: item.district_name, value: item.district_id, key: item.district_name }))}
                                                >
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col md={{ span: 8 }} span={24}>
                                            <Form.Item
                                                className='mb-2'
                                                name="ward"
                                                label="Xã/Phường"
                                                rules={[{ required: true, message: 'Chọn xã hoặc phường!' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    optionFilterProp="label"
                                                    size='large'
                                                    className='mb-2'
                                                    placeholder='Chọn xã hoặc phường'
                                                // options={ward?.map(item => ({ label: item.ward_name, value: item.ward_id, key: item.ward_name }))}
                                                >
                                                </Select>
                                            </Form.Item>
                                        </Col> */}

                                <Col span={24}>
                                    <Form.Item
                                        className='mb-2'
                                        name="address"
                                        label="Địa chỉ"
                                        rules={[{ required: true, message: 'Nhập địa chỉ!' }]}
                                    >
                                        <Input
                                            size='large'
                                            placeholder='Nhập địa chỉ'
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