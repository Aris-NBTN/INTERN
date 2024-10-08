import { AutoComplete, Button, Card, Col, Divider, Empty, Form, Input, Modal, Row, Tabs, theme, Typography } from 'antd'
import { useEffect, useState } from 'react'
import Layout from '~/components/layout/Public/Layout';

import './CheckOut.css'
import zalopay from '~/assets/logo/zalopay.png'
import momo from '~/assets/logo/momo.png'
import vnpay from '~/assets/logo/vnpay.png'
import vietqr from '~/assets/logo/vietqr.png'

import { paymentApi } from '~/apis/paymentApi'
import { useNavigate, NavLink } from 'react-router-dom';
import { toastError, toastLoading } from '~/components/toast';
import { useDispatch, useSelector } from 'react-redux';
import useCartPrices from '~/hooks/Cart';
import { FormatPrice } from '~/components/table/Format';
import { orderApi } from '~/apis/orderApi';
import { getInfoApi } from '~/redux/slices/Data/infoSlice';
import { keyBankApi } from '~/apis/keyBankApi';

const Payment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formInfo] = Form.useForm()

    const user = useSelector((state) => state.auth?.user);
    const { info, loading } = useSelector(state => state.info);

    const [keyBank, setKeyBank] = useState('')
    const [emails, setEmails] = useState([]);
    const [openConfirm, setOpenConfirm] = useState(false);
    const { carts, total } = useCartPrices();

    const handleSearch = (value) => {
        const emailSuffixes = ['@gmail.com', '@yahoo.com', '@outlook.com'];
        let newOptions = [];
        if (!value || value.includes('@')) {
            newOptions = [];
        } else {
            newOptions = emailSuffixes.map((suffix) => ({
                label: `${value}${suffix}`,
                value: `${value}${suffix}`,
            }));
        }
        setEmails(newOptions);
    };

    const handlePayment = (values) => {
        const product = carts.map(item => ({
            "id": item._id,
            "name": item.name,
            "price": item.price,
            "quantity": 1
        }))

        toastLoading('', 'Đang xử lý thanh toán')
        const id = Number(String(Date.now()).slice(-3) + String(Math.floor(Math.random() * 1000)).slice(-3))
        localStorage.setItem('orderCode', id)

        values.orderId = id
        values.product = product
        values.idUser = user._id

        orderApi.add(values)
            .then(() => {
                setTimeout(() => {
                    paymentApi.Bank({ id: id, product: product, total: total })
                        .then(res => {
                            window.location.href = res.url
                        })
                        .catch(() => {
                            toastError('', 'Thanh toán thất bại')
                        })
                }, 500);
            })
            .catch(err => {
                toastError('', 'Tạo đơn hàng thất bại!', err)
            })
    }

    const fetchProvince = () => {
        // provinceApi.province().then(res => {
        //     setProvince(res.results)
        //     console.log(res.results);
        // })
    }

    // const fetchDistrict = (value) => {
    //     provinceApi.district(value).then(res => {
    //         setDistrict(res.results)
    //         formInfo.setFieldsValue({ district: null });
    //         formInfo.setFieldsValue({ ward: null });
    //     })
    // };

    // const fetchWard = (value) => {
    //     provinceApi.ward(value).then(res => {
    //         setWard(res.results)
    //         formInfo.setFieldsValue({ ward: null });
    //     })
    // };

    useEffect(() => {
        fetchProvince();
    }, [])

    useEffect(() => {
        if (loading) {
            dispatch(getInfoApi());
        }
    }, []);

    useEffect(() => {
        keyBankApi.get().then(res => {
            setKeyBank(res[0])
        })
    }, [])

    useEffect(() => {
        if (user) {
            formInfo.setFieldsValue({
                name: user.name || '',
                phone: user.phone || '',
                email: user.email || '',
            });
        }
    }, [user]);

    return (
        <Layout title="Thanh toán">
            <section>
                <Row gutter={[18, 18]}>
                    <Col span={24} xl={{ span: 17 }} lg={{ span: 15 }} md={{ span: 24, order: 1 }} xs={{ order: 2 }}>
                        <Card>
                            <Form
                                scrollToFirstError={true}
                                form={formInfo}
                                name="customForm"
                                layout="vertical"
                                onFinish={handlePayment}
                            >
                                <Form.Item
                                    className='mb-4'
                                    name="name"
                                    label="Họ và tên"
                                    rules={[{ required: true, message: 'Nhập họ và tên!' }]}
                                >
                                    <Input
                                        size='large'
                                        placeholder='Nhập họ và tên'
                                    />
                                </Form.Item>

                                <Form.Item
                                    className='mb-4'
                                    name="phone"
                                    label="Số điện thoại"
                                    rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
                                >
                                    <Input
                                        size='large'
                                        placeholder='Nhập số điện thoại'
                                    />
                                </Form.Item>

                                <Form.Item
                                    className='mb-4'
                                    name="email"
                                    label="Email"
                                    rules={[{ required: true, message: 'Nhập email!' }]}
                                >
                                    <AutoComplete
                                        options={emails}
                                        onSearch={handleSearch}
                                    >
                                        <Input
                                            size='large'
                                            placeholder='Nhập email'
                                        />
                                    </AutoComplete>
                                </Form.Item>

                                {/* <Row gutter={[16, 16]}>
                                    <Col md={{ span: 8 }} span={24}>
                                        <Form.Item
                                            className='mb-4'
                                            name="province"
                                            label="Tỉnh/Thành phố"
                                            rules={[{ required: true, message: 'Chọn tỉnh hoặc thành phố!' }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="label"
                                                size='large'
                                                onChange={fetchDistrict}
                                                placeholder='Chọn tỉnh hoặc thành phố'
                                                options={province?.map(item => ({ label: item.province_name, value: item.province_id, key: item.province_name }))}
                                            >
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col md={{ span: 8 }} span={24}>
                                        <Form.Item
                                            className='mb-4'
                                            name="district"
                                            label="Quận/Huyện"
                                            rules={[{ required: true, message: 'Chọn quận hoặc huyện!' }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="label"
                                                size='large'
                                                onChange={fetchWard}
                                                placeholder='Chọn quận hoặc huyện'
                                                options={district?.map(item => ({ label: item.district_name, value: item.district_id, key: item.district_name }))}
                                            >
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col md={{ span: 8 }} span={24}>
                                        <Form.Item
                                            className='mb-4'
                                            name="ward"
                                            label="Xã/Phường"
                                            rules={[{ required: true, message: 'Chọn xã hoặc phường!' }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="label"
                                                size='large'
                                                placeholder='Chọn xã hoặc phường'
                                                options={ward?.map(item => ({ label: item.ward_name, value: item.ward_id, key: item.ward_name }))}
                                            >
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row> */}

                                <Form.Item
                                    className='mb-4'
                                    name="address"
                                    label="Địa chỉ"
                                    rules={[{ required: true, message: 'Nhập địa chỉ!' }]}
                                >
                                    <Input
                                        size='large'
                                        placeholder='Nhập địa chỉ'
                                    />
                                </Form.Item>

                                <Form.Item
                                    className='mb-0'
                                    name="note"
                                    label="Ghi chú"
                                    rules={[{ required: true, message: 'Nhập ghi chú!' }]}
                                >
                                    <Input.TextArea
                                        style={{ height: 120, minHeight: 190 }}
                                        size='large'
                                        placeholder='Nhập ghi chú'
                                    />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>

                    <Col className='mx-auto' span={24} xl={{ span: 7 }} lg={{ span: 9 }} md={{ span: 14, order: 2 }} xs={{ order: 1 }}>
                        <Card className='sticky top-24'>
                            <Divider className='!mt-2' style={{ borderColor: 'rgb(212 212 212)' }}>Đơn hàng của bạn</Divider>
                            <div className="flex flex-col justify-between">
                                {carts.length > 0 ? (
                                    <>
                                        {carts.map((item, index) => (
                                            <div key={index} className="flex justify-between w-full mb-2">
                                                <Typography.Text>{item.name}</Typography.Text>
                                                <Typography.Text type='danger' strong>{FormatPrice(item.price)}</Typography.Text>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <Empty description='Chưa có khóa học nào trong giỏ hàng' />
                                )}
                            </div>
                            <Divider style={{ borderColor: 'rgb(212 212 212)' }}>Tổng cộng</Divider>
                            <div className="flex justify-center">
                                <Typography.Title className='!my-0 !text-center' level={4} type='danger'>{FormatPrice(total)}</Typography.Title>
                            </div>
                            <Divider style={{ borderColor: 'rgb(212 212 212)' }}>Phương thức thanh toán</Divider>
                            <Tabs
                                defaultActiveKey="BankAccount"
                                centered
                                type="card"
                                items={
                                    [
                                        {
                                            key: 'BankAccount',
                                            label: 'Tài khoản ngân hàng',
                                            children:
                                                <>
                                                    <div className="radio-inputs">
                                                        <label>
                                                            <input className="radio-input" type="radio" name="engine" />
                                                            <span className="radio-tile">
                                                                <span className="radio-icon">
                                                                    <img src={vietqr} alt="Thanh toán khóa học Chicken War Studio thông qua Zalopay" />
                                                                </span>
                                                                <span className="radio-label">VietQR</span>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </>
                                            ,
                                        },
                                        {
                                            key: 'ElectronicWallet',
                                            label: 'Ví điện tử',
                                            children:
                                                <div className='w-full'>
                                                    <div className="radio-inputs">
                                                        <label>
                                                            <input className="radio-input" type="radio" name="engine" />
                                                            <span className="radio-tile">
                                                                <img src={momo} alt="Thanh toán khóa học Chicken War Studio thông qua Zalopay" />
                                                                <span className="radio-label">Momo</span>
                                                            </span>
                                                        </label>

                                                        <label>
                                                            <input className="radio-input" type="radio" name="engine" />
                                                            <span className="radio-tile">
                                                                <span className="radio-icon">
                                                                    <img src={zalopay} alt="Thanh toán khóa học Chicken War Studio thông qua Zalopay" />
                                                                </span>
                                                                <span className="radio-label">ZaloPay</span>
                                                            </span>
                                                        </label>

                                                        <label>
                                                            <input className="radio-input" type="radio" name="engine" />
                                                            <span className="radio-tile">
                                                                <span className="radio-icon">
                                                                    <img src={vnpay} alt="Thanh toán khóa học Chicken War Studio thông qua Zalopay" />
                                                                </span>
                                                                <span className="radio-label">VNPay</span>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            ,
                                        },
                                    ]
                                }
                            />

                            <Divider style={{ borderColor: 'rgb(212 212 212)' }}></Divider>
                            {carts.length > 0 ? (
                                <Button type='primary' onClick={() => setOpenConfirm(true)} className='w-full' size='large'>Thanh Toán</Button>
                            ) : (
                                <>
                                    <Button className='w-full mb-4' size='large'>Chưa có sản phẩm trong giỏ hàng</Button>
                                    <Button type='primary' onClick={() => navigate('/courses')} className='w-full' size='large'>Thêm Sản Phẩm</Button>
                                </>
                            )}
                        </Card>
                    </Col>
                </Row>
            </section>

            <Modal
                title="Xác nhận thanh toán"
                centered
                open={openConfirm}
                onOk={() => {
                    setOpenConfirm(false);
                    formInfo.submit();
                }}
                okText='Thanh toán'
                onCancel={() => setOpenConfirm(false)}
                width={800}
            >
                <Typography className='!mb-3'>Trước khi thanh toán vui lòng xác nhận lại <span ><Typography.Link>đơn hàng </Typography.Link></span> và <span><Typography.Link>tài khoản nhận tiền</Typography.Link></span> của {info[0]?.name}:  </Typography>

                <Divider className='!mt-2' style={{ borderColor: 'rgb(212 212 212)' }}>Đơn hàng của bạn</Divider>
                <div className="flex flex-col justify-between">
                    {carts.length > 0 ? (
                        <>
                            {carts.map((item, index) => (
                                <div key={index} className="flex justify-between w-full mb-2">
                                    <Typography.Text>{item.name}</Typography.Text>
                                    <Typography.Text type='danger' strong>{FormatPrice(item.price)}</Typography.Text>
                                </div>
                            ))}
                        </>
                    ) : (
                        <Empty description='Chưa có khóa học nào trong giỏ hàng' />
                    )}
                </div>

                <Divider style={{ borderColor: 'rgb(212 212 212)' }}>Tổng cộng</Divider>
                <div className="flex justify-center">
                    <Typography.Title className='!my-0 !text-center' level={4} type='danger'>{FormatPrice(total)}</Typography.Title>
                </div>

                <Divider style={{ borderColor: 'rgb(212 212 212)' }}>Phương thức thanh toán</Divider>
                <div className="flex justify-center">
                    <Typography.Link className='!my-0 !text-center' level={4}>Chuyển khoản ngân hàng</Typography.Link>
                </div>

                <Divider style={{ borderColor: 'rgb(212 212 212)' }}>Thông tin tài khoản nhận tiền của <span><Typography.Link>{info[0]?.name}</Typography.Link></span></Divider>
                <Typography.Title className='!my-3' level={5}>Tên Ngân Hàng:  <span><Typography.Link>{keyBank?.name}</Typography.Link></span> </Typography.Title>
                <Typography.Title className='!my-3' level={5}>Tên Tài Khoản: <span><Typography.Link>{keyBank?.nameAccount} </Typography.Link> </span> </Typography.Title>
                <Typography.Title className='!my-3' level={5}>Số Tài Khoản: <span><Typography.Link>{keyBank?.account} </Typography.Link></span> </Typography.Title>
                <Typography.Title level={5} type='danger' className='!my-3 text-end'>Không biết thanh toán?
                    <span>
                        <NavLink to='/huong-dan-thanh-toan'>Hướng dẫn!</NavLink>
                    </span>
                </Typography.Title>
            </Modal>
        </Layout>
    )
}

export default Payment