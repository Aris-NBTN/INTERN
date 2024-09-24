import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Button, Modal } from 'antd';

import LayoutAdmin from '~/components/layout/Admin/Layout';
import Table from '~/components/table/Table';
import { FilterText, FilterDate, FilterSelect } from '~/components/table/Filter';
import Invoice from './Invoice';

import { exportDataExcel, exportToPDF } from '~/utils/export';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderApi } from '~/redux/slices/Data/orderSlice';
import { FormatDay } from '~/components/table/Format';

const Orders = () => {
    const { order, loading } = useSelector((state) => state.order);
    const [openInFor, setOpenInFor] = useState(false);
    const [inFo, setInFo] = useState();
    const dispatch = useDispatch();
    const invoiceRef = useRef(null);

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderId',
            width: '10%',
            ...FilterText({ dataIndex: 'orderId' })
        },
        {
            title: 'Người đặt hàng',
            dataIndex: 'name',
            width: '15%',
            ...FilterText({ dataIndex: 'name' })
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            width: '10%',
            ...FilterDate({ dataIndex: 'createdAt' }),
            render: (dayCreate) => FormatDay(dayCreate),
        },
        {
            title: 'Ngày thanh toán',
            dataIndex: 'updatedAt',
            width: '10%',
            ...FilterDate({ dataIndex: 'updatedAt' }),
            render: (updatedAt) => FormatDay(updatedAt),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '10%',
            ...FilterSelect('status', [{ value: true, text: 'Đã thanh toán' }, { value: false, text: 'Chưa thanh toán' }]),
            render: (status) => (status === true ?
                <span className='text-success'>Đã thanh toán</span> :
                <span className='text-danger'>Chưa thanh toán</span>
            )
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            width: '14%',
        },
        {
            title: 'Thông tin',
            dataIndex: 'info',
            width: '11%',
            render: (text, record) =>
                <>
                    <Button onClick={() => {
                        setOpenInFor(true);
                        setInFo(record);
                    }}>
                        Chi tiết đơn hàng
                    </Button>
                </>
            ,
        },
    ];

    const dataPages = useMemo(() =>
        order.map((page) => ({
            ...page,
            key: page._id,
        })),
        [order]
    );

    useEffect(() => {
        if (loading === true) {
            dispatch(getOrderApi());
        }
    }, []);

    return (
        <LayoutAdmin
            header={
                <>
                    <div className='flex items-center'>
                        <h6 className='mb-0'>ĐƠN HÀNG</h6>
                    </div>
                </>
            }
            button={
                <>
                    <Button onClick={() => exportDataExcel(order, 'Order.xlsx')} type='primary'>Xuất file Excel</Button>
                </>
            }
        >
            <Table
                loading={loading}
                data={dataPages}
                columns={columns}
                colEdit={false}
            />
            <Modal
                centered
                open={openInFor}
                onOk={() => setOpenInFor(false)}
                onCancel={() => {
                    setOpenInFor(false)
                    setInFo();
                }}
                footer={
                    <>
                        <Button onClick={() => {
                            setOpenInFor(false);
                            setInFo();
                        }}>
                            Hủy
                        </Button>
                        <Button type='primary' onClick={() => exportToPDF(invoiceRef)}>Xuất file PDF</Button>
                    </>
                }
                width={800}
            >
                <div ref={invoiceRef}>
                    <Invoice info={inFo} />
                </div>
            </Modal>
        </LayoutAdmin>
    );
}

export default Orders;
