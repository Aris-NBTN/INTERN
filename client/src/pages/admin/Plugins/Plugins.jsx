import { Button } from 'antd'
import React, { useEffect, useState } from 'react'

import LayoutAdmin from '~/components/layout/Admin/Layout'
import Table from '~/components/table/Table';
import { FaInfinity } from "react-icons/fa";

const Plugins = () => {
    const [data, setData] = useState([
        {
            key: 1,
            name: 'Icon',
            description: 'Plugin tạo block Icon hiển thị icon',
            status: 'Hoạt động',
            DateEnd: <FaInfinity />,
            DateCreate: '26/8/2024',
            DateUpdate: '26/8/2024',
        },
        {
            key: 2,
            name: '3D',
            description: 'Plugin tạo block 3D hiển thị icon',
            status: 'Hoạt động',
            DateEnd: <FaInfinity />,
            DateCreate: '26/8/2024',
            DateUpdate: '26/8/2024',
        },
        {
            key: 3,
            name: 'Basic',
            description: 'Plugin tạo các block trong nhóm cơ bản hiển thị icon',
            status: 'Hoạt động',
            DateEnd: <FaInfinity />,
            DateCreate: '26/8/2024',
            DateUpdate: '26/8/2024',
        },
        {
            key: 4,
            name: 'Multi Block',
            description: 'Plugin tạo các block trong các nhóm Khối Blog,... hiển thị icon',
            status: 'Hoạt động',
            DateEnd: <FaInfinity />,
            DateCreate: '26/8/2024',
            DateUpdate: '26/8/2024',
        },
        {
            key: 5,
            name: 'Multi Font',
            description: 'Plugin tạo thêm font chữ cho website',
            status: 'Hoạt động',
            DateEnd: <FaInfinity />,
            DateCreate: '26/8/2024',
            DateUpdate: '26/8/2024',
        },
        {
            key: 6,
            name: 'Link Block',
            description: 'Plugin tạo block dạng link cho website',
            status: 'Hoạt động',
            DateEnd: <FaInfinity />,
            DateCreate: '26/8/2024',
            DateUpdate: '26/8/2024',
        },
        {
            key: 7,
            name: 'User Block',
            description: 'Plugin tạo block trực tiếp cho người dùng',
            status: 'Hoạt động',
            DateEnd: <FaInfinity />,
            DateCreate: '26/8/2024',
            DateUpdate: '26/8/2024',
        },
    ]);
    const [loading, setLoading] = useState(true);

    const columnsCourse = [
        {
            title: 'Tên Plugins',
            dataIndex: 'name',
            width: '30%',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: '30%',
        },
        {
            title: 'Trang thái',
            dataIndex: 'status',
            width: '15%',
        },
        {
            title: 'Hạn sử dụng',
            dataIndex: 'DateEnd',
            width: '15%',
        },
        {
            title: 'Ngày thêm',
            dataIndex: 'DateCreate',
            width: '15%',
        },
        {
            title: 'Ngày cập nhập',
            dataIndex: 'DateUpdate',
            width: '15%',
        },
    ];

    const fecthData = () => {
        setLoading(false);
    }

    const handlePutCourse = (newData, oldData) => {

    }

    const handleDeleteCourse = (oldData) => {

    }

    useEffect(() => {
        fecthData();
    }, [])

    return (
        <LayoutAdmin
            header={'PLUGINS'}
            button={
                <>
                    <Button type='primary'>Thêm Plugins</Button>
                </>
            }
        >
            <Table
                loading={loading}
                data={data}
                columns={columnsCourse}
                onSave={handlePutCourse}
                colEdit={false}
                onDelete={handleDeleteCourse}
            />
        </LayoutAdmin>
    )
}

export default Plugins