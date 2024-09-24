import { Card, Input, Form, Col, Row, Typography, Select } from 'antd'
import { useEffect, useState } from 'react'
import LayoutAdmin from '~/components/layout/Admin/Layout'

import { bankApi } from '~/apis/bankApi'

const KeyBank = () => {

    const [formInfo] = Form.useForm();
    const [banks, setBanks] = useState([]);

    const fetchDataBanks = () => {
        bankApi.bankVN()
            .then((res) => {
                setBanks(res.data);
            })
    }

    const putInfo = () => {
    }

    useEffect(() => {
        fetchDataBanks();
    }, [])

    return (
        <LayoutAdmin
            header='CHUYỂN KHOẢN'
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
                            title='Thông Tin Ngân Hàng'
                        >
                            <Form.Item
                                className='mb-2'
                                name="nameBank"
                                label="Tên ngân hàng"
                                rules={[{ required: true, message: 'Nhập tên ngân hàng!' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn ngân hàng"
                                    options={banks.map((bank) => ({ label: bank.shortName, value: bank.bin }))}
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="accountBank"
                                label="Số tài khoản"
                                rules={[{ required: true, message: 'Nhập số tài khoản!' }]}
                            >
                                <Input
                                    className='mb-2'
                                    placeholder="Nhập số tài khoản"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="nameAccount"
                                label="Tên tài khoản"
                                rules={[{ required: true, message: 'Nhập tên tài khoản!' }]}
                            >
                                <Input
                                    className='mb-2'
                                    placeholder="Nhập tên tài khoản"
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col md={{ span: 12 }} span={24}>
                        <Card
                            title='Thông Tin Chuyển Khoản Qua Ngân Hàng'
                        >
                            <Form.Item
                                className='mb-2'
                                name="clientID"
                                label="Client ID"
                                rules={[{ required: true, message: 'Nhập Client ID!' }]}
                            >
                                <Input.Password
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập Client ID"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="apiKey"
                                label="Api Key"
                                rules={[{ required: true, message: 'Nhập Apikey!' }]}
                            >
                                <Input.Password
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập Api key"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="checksumKey"
                                label="Checksum Key"
                                rules={[{ required: true, message: 'Nhập Checksum Key!' }]}
                            >
                                <Input.Password
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập Checksum Key"
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col md={{ span: 8 }} span={24}>
                        <Card
                            title='MoMo'
                        >
                            <Form.Item
                                className='mb-2'
                                name="accessKeyMoMo"
                                label="AccessKey"
                                rules={[{ required: true, message: 'Nhập key!' }]}
                            >
                                <Input.Password
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>
                            <Form.Item
                                className='mb-2'
                                name="secretKeyMoMo"
                                label="SecretKey"
                                rules={[{ required: true, message: 'Nhập key!' }]}
                            >
                                <Input.Password
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col md={{ span: 8 }} span={24}>
                        <Card
                            title='ZaloPay'
                        >
                            <Form.Item
                                className='mb-2'
                                name="Key1ZaloPay"
                                label="Key1"
                                rules={[{ required: true, message: 'Nhập key!' }]}
                            >
                                <Input.Password
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>
                            <Form.Item
                                className='mb-2'
                                name="Key2ZaloPay"
                                label="Key2"
                                rules={[{ required: true, message: 'Nhập key!' }]}
                            >
                                <Input.Password
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col md={{ span: 8 }} span={24}>
                        <Card
                            title='VNPay'
                        >
                            <Form.Item
                                className='mb-2'
                                name="Key1VNPay"
                                label="Key1"
                                rules={[{ required: true, message: 'Nhập key!' }]}
                            >
                                <Input.Password
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>
                            <Form.Item
                                className='mb-2'
                                name="Key2VNPay"
                                label="Key2"
                                rules={[{ required: true, message: 'Nhập key!' }]}
                            >
                                <Input.Password
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </LayoutAdmin>
    )
}

export default KeyBank