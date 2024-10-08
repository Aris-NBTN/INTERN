import { Button, Card, Input, Form, Col, Row, Space } from 'antd'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import LayoutAdmin from '~/components/layout/Admin/Layout'
import { getInfoApi, putInfoApi } from '~/redux/slices/Data/infoSlice';
import { genericDispatch } from '~/redux/utils';

import { id_info } from '~/utils';

const Website = () => {
    const [formInfo] = Form.useForm();
    const dispatch = useDispatch();

    const { info, loading } = useSelector(state => state.info);

    const handlePutInfo = (data) => {
        genericDispatch(dispatch, putInfoApi({ id: id_info, ...data }));
    };

    useEffect(() => {
        if (loading) {
            dispatch(getInfoApi());
        }
    }, []);

    useEffect(() => {
        if (info?.newData?.[0]) {
            formInfo.setFieldsValue(info?.newData?.[0]);
        }
    }, [info]);

    return (
        <LayoutAdmin
            title={'Thông tin Website'}
            header='WEBSITE'
            button={
                <>
                    <Button type='primary' onClick={() => formInfo.submit()}>Lưu thông tin</Button>
                </>
            }
        >
            <Form
                form={formInfo}
                className='w-full'
                name="customForm"
                layout="vertical"
                onFinish={handlePutInfo}
            >
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Card
                            className='h-full'
                            title='Thông tin webstie'
                        >
                            <Row gutter={[18, 18]}>
                                <Col md={{ span: 12 }} span={24}>
                                    <Form.Item
                                        className='mb-2'
                                        name="name"
                                        label="Tên Website"
                                        rules={[{ required: true, message: 'Nhập tên Website!' }]}
                                    >
                                        <Input
                                            size='large'
                                            className='mb-2'
                                            placeholder="Nhập tên Website"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col md={{ span: 12 }} span={24}>
                                    <Form.Item
                                        className='mb-2'
                                        name="manage"
                                        label="Tên quản lý"
                                        rules={[{ required: true, message: 'Nhập tên quản lý!' }]}
                                    >
                                        <Input
                                            size='large'
                                            className='mb-2'
                                            placeholder="Nhập tên quản lý"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col md={{ span: 12 }} span={24}>
                                    <Form.Item
                                        className='mb-2'
                                        name="phone"
                                        label="Số điện thoại"
                                        rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
                                    >
                                        <Input
                                            size='large'
                                            className='mb-2'
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </Form.Item>

                                </Col>

                                <Col md={{ span: 12 }} span={24}>
                                    <Form.Item
                                        className='mb-2'
                                        name="email"
                                        label="Email"
                                        rules={[{ required: true, message: 'Nhập email!' }]}
                                    >
                                        <Input
                                            size='large'
                                            className='mb-2'
                                            placeholder="Nhập email"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col md={{ span: 12 }} span={24}>
                                    <Form.Item
                                        className='mb-2'
                                        name="address"
                                        label="Địa chỉ"
                                        rules={[{ required: true, message: 'Nhập địa chỉ!' }]}
                                    >
                                        <Input
                                            size='large'
                                            className='mb-2'
                                            placeholder="Nhập địa chỉ"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col md={{ span: 12 }} span={24}>
                                    <Form.Item
                                        className='mb-2'
                                        name="description"
                                        label="Mô tả webiste"
                                        rules={[{ required: true, message: 'Nhập Mô tả!' }]}
                                    >
                                        <Input
                                            size='large'
                                            className='mb-2'
                                            placeholder="Nhập Mô tảỉ"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col md={{ span: 12 }} span={24}>

                                    <Form.Item
                                        className='mb-2'
                                        name="keywords"
                                        label="Từ khóa tìm kiếm"
                                        rules={[{ required: true, message: 'Nhập từ khóa !' }]}
                                    >
                                        <Input
                                            size='large'
                                            className='mb-2'
                                            placeholder="Nhập từ khóa"
                                        />
                                    </Form.Item>

                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col className='mb-6' span={24}>
                        <Card title='Ảnh website'>
                            <Row gutter={[24, 24]}>
                                <Col xl={{ span: 8 }} lg={{ span: 12 }} span={24}>
                                    <Card title='Icon website'>

                                    </Card>
                                </Col>
                                <Col xl={{ span: 8 }} lg={{ span: 12 }} span={24}>
                                    <Card title='Ảnh trang Login'>

                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </LayoutAdmin>
    )
}

export default Website