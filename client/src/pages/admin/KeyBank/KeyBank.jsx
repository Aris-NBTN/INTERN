import { Card, Input, Form, Col, Row, Typography, Select, Button } from 'antd'
import { useEffect, useState } from 'react'
import LayoutAdmin from '~/components/layout/Admin/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { getBankApi } from '~/redux/slices/Data/bankSlice'
import { genericDispatch } from '~/redux/utils'
import { getKeyBankApi, putKeyBankApi } from '~/redux/slices/Data/keyBankSlice'

import { id_keyBank } from '~/utils'
// import { generateEncryptedValue } from '~/utils/crypto'

const KeyBank = () => {
    const dispatch = useDispatch();
    const [formPayment] = Form.useForm();
    const { loading, bank } = useSelector(state => state.bank);
    const { loading: loadingKeyBank, keyBank } = useSelector(state => state.keyBank);

    const handldePutPayment = (data) => {
        // const secureData = (data) => {
        //     const fieldsToSkip = ['nameAccount', 'account', 'name'];
        //     return Object.keys(data).reduce((acc, key) => {
        //         const value = data[key];
        //         if (fieldsToSkip.includes(key) || !value) {
        //             acc[key] = value;
        //         } else {
        //             acc[key] = generateEncryptedValue(value, import.meta.env.VITE_API_URL);
        //         }
        //         return acc;
        //     }, {});
        // };
        // genericDispatch(dispatch, putKeyBankApi({ id: id_keyBank, ...secureData(data) }));
    }

    useEffect(() => {
        if (loading) {
            dispatch(getBankApi())
        }
    }, [])

    useEffect(() => {
        if (loadingKeyBank) {
            dispatch(getKeyBankApi())
        }
    }, [])

    useEffect(() => {
        if (keyBank?.newData?.[0]) {
            formPayment.setFieldsValue(keyBank?.newData?.[0]);
        }
    }, [keyBank]);

    return (
        <LayoutAdmin
            header='CHUYỂN KHOẢN'
            button={<Button onClick={() => formPayment.submit()} type='primary'>Lưu thông tin</Button>}
        >
            <Form
                form={formPayment}
                className='w-full'
                name="customForm"
                layout="vertical"
                onFinish={handldePutPayment}
            >
                <Row gutter={[24, 24]}>
                    <Col md={{ span: 12 }} span={24}>
                        <Card
                            loading={loadingKeyBank}
                            className='h-full'
                            title='Thông Tin Ngân Hàng'
                        >
                            <Form.Item
                                className='mb-2'
                                name="name"
                                label="Tên ngân hàng"
                                rules={[{ required: true, message: 'Nhập tên ngân hàng!' }]}
                            >
                                <Select
                                    size='large'
                                    showSearch
                                    placeholder="Chọn ngân hàng"
                                    options={bank?.data?.map((bank) => ({ label: bank.shortName, value: bank.shortName }))}
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="account"
                                label="Số tài khoản"
                                rules={[{ required: true, message: 'Nhập số tài khoản!' }]}
                            >
                                <Input
                                    size='large'
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
                                    size='large'
                                    className='mb-2'
                                    placeholder="Nhập tên tài khoản"
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col md={{ span: 12 }} span={24}>
                        <Card
                            loading={loadingKeyBank}
                            title=<div className='flex items-center justify-between'>
                                <Typography>Thông Tin Chuyển Khoản Qua Ngân Hàng</Typography>
                                <Typography.Link target='_blank' href='https://my.payos.vn/login'>
                                    <img className='h-10' src="/payos/payos-logo.svg" alt="" />
                                </Typography.Link>
                            </div>
                        >
                            <Form.Item
                                className='mb-2'
                                name="clientID"
                                label="Client ID"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập Client ID"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="apiKey"
                                label="Api Key"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập Api key"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="checksumKey"
                                label="Checksum Key"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập Checksum Key"
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col md={{ span: 8 }} span={24}>
                        <Card
                            loading={loadingKeyBank}
                            title=<div className='flex items-center justify-between'>
                                <Typography>MoMo</Typography>
                                <Typography.Link target='_blank' href='https://my.payos.vn/login'>
                                    <img className='h-10' src="/momo/momo.svg" alt="" />
                                </Typography.Link>
                            </div>
                        >
                            <Form.Item
                                className='mb-2'
                                name="momoKey1"
                                label="AccessKey"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="momoKey2"
                                label="SecretKey"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col md={{ span: 8 }} span={24}>
                        <Card
                            loading={loadingKeyBank}
                            title=<div className='flex items-center justify-between'>
                                <Typography>ZaloPay</Typography>
                                <Typography.Link target='_blank' href='https://my.payos.vn/login'>
                                    <img className='h-10' src="/zalo/zalo.svg" alt="" />
                                </Typography.Link>
                            </div>
                        >
                            <Form.Item
                                className='mb-2'
                                name="zaloKey1"
                                label="Key1"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="zaloKey2"
                                label="Key2"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col className='mb-6' md={{ span: 8 }} span={24}>
                        <Card
                            loading={loadingKeyBank}
                            title=<div className='flex items-center justify-between'>
                                <Typography>VNPay</Typography>
                                <Typography.Link target='_blank' href='https://my.payos.vn/login'>
                                    <img className='h-10' src="/vn/vn.svg" alt="" />
                                </Typography.Link>
                            </div>
                        >
                            <Form.Item
                                className='mb-2'
                                name="vnKey1"
                                label="Key1"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="vnKey2"
                                label="Key2"
                            >
                                <Input.Password
                                    size='large'
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