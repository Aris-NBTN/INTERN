import { Button, Result, Typography } from 'antd';
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

import Layout from '~/components/layout/Public/Layout';
import { toastError } from '~/components/toast';

const Success = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = localStorage.getItem('orderCode');
    const orderId = searchParams.get('orderCode')

    useEffect(() => {
        if (id !== orderId || (!id && !orderId)) {
            toastError('success', 'Đơn Hàng Không Tồn Tại!', 'Vui lòng thử lại sau!');
            navigate('/');
        } else {
            localStorage.removeItem('orderCode');
        }
    }, [navigate, searchParams]);

    return (
        <Layout title="thanh toán thành công">
            <section>
                <Result
                    status="success"
                    title={`Đơn hàng ${orderId} của bạn đã được thanh toán thành công!`}
                    subTitle={<>
                        Vui lòng truy cập! <Typography.Link href='/user/orders'>Trang đơn hàng của bạn</Typography.Link> để xem chi tiết đơn hàng!
                    </>}
                    extra={[
                        <Button type="primary" onClick={() => navigate('/courses')} key="buy">Mua thêm khóa học</Button>,
                        <Button type="primary" onClick={() => navigate('/user/courses')} key="console">Đến trang khóa học của bạn</Button>,

                    ]}
                />
            </section>
        </Layout>
    )
}

export default Success