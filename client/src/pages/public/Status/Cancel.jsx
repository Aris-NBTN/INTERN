import { Button, Result } from 'antd';
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '~/components/layout/Public/Layout';
import { toastError } from '~/components/toast';

const Cancel = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const id = localStorage.getItem('orderCode');
        const orderId = searchParams.get('orderCode')

        if (id !== orderId || (!id && !orderId)) {
            toastError('', 'Đơn hàng không tồn tại!', 'Vui lòng thử lại sau!');
            navigate('/');
        } else {
            toastError('', 'Xác nhận hủy thành công!', 'Bạn đã hủy đơn hàng thành công!');
            localStorage.removeItem('orderCode');
        }
    }, [navigate, searchParams]);

    return (
        <Layout title="thanh toán thất bại">
            <section>
                <Result
                    className='px-0'
                    status="500"
                    title="Hủy Đơn Hàng"
                    subTitle="Đơn hàng đã hủy thành công!"
                    extra={
                        <div className='flex flex-wrap justify-center gap-3'>
                            <Button size='large' onClick={() => navigate('/checkout')} type="primary">Xem lại đơn hàng</Button>
                            <Button size='large' onClick={() => navigate('/courses')} type="primary">Xem khóa học khác...</Button>
                        </div>
                    }
                />
            </section>
        </Layout>
    )
}

export default Cancel