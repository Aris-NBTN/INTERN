import { useEffect, useMemo, useState } from 'react'
import { Button, Input, Modal, Tabs, Form, Typography, TreeSelect, Select, Tooltip } from 'antd';

import LayoutAdmin from '~/components/layout/Admin/Layout'
import Table from '~/components/table/Table';

import { FilterDate, FilterSelect, FilterText } from '~/components/table/Filter';
import { FindNameById, FormatDay, FormatTag } from '~/components/table/Format'
import { exportDataExcel } from '~/utils/export'

import { useDispatch, useSelector } from 'react-redux';
import { getUsersApi, delUsersApi, putUsersApi } from '~/redux/slices/Data/usersSlice';
import { getRoleApi, addRoleApi, delRoleApi, putRoleApi } from '~/redux/slices/Data/roleSlice';
import { getCourseApi } from '~/redux/slices/Data/coursesSlice';
import { genericDispatch } from '~/redux/utils';

const User = () => {
    const dispatch = useDispatch();
    const userType = useSelector((state) => state.auth?.user?.userType);

    const { users, loading } = useSelector((state) => state.users);
    const { roles, loading: loadingRoles } = useSelector((state) => state.roles);
    const { courses, loading: loadingCourses } = useSelector((state) => state.courses);

    const [formRole] = Form.useForm();
    const [formCourses] = Form.useForm();

    const [openRole, setOpenRole] = useState(false);
    const [openCourses, setOpenCourses] = useState(false);

    const data = useMemo(() =>
        users.map((user) => ({
            ...user,
            key: user._id,
            activeStatus: user.activeStatus ? 'Cho phép' : 'Chặn'
        })),
        [users]
    );

    const dataRole = useMemo(() =>
        roles.map((role) => ({
            ...role,
            key: role._id,
        })),
        [roles]
    );

    const dataCourses = useMemo(() =>
        courses.map((course) => ({
            key: course._id,
            label: course.name,
            value: course._id
        })),
        [courses]
    );

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            width: '10%',
            editable: false,
            ellipsis: {
                showTitle: true,
            },
            ...FilterText({ dataIndex: 'name' }),
            render: (name) => (
                <Tooltip placement="topLeft" title={name}>
                    {name}
                </Tooltip>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '10%',
            editable: false,
            ...FilterText({ dataIndex: 'email' }),
            render: (email) => <>
                <Typography.Paragraph
                    ellipsis={{ suffix: '' }}
                >
                    {email}
                </Typography.Paragraph>
            </>
        },
        {
            title: 'Điện Thoại',
            dataIndex: 'phone',
            width: '7%',
            editable: false,
            ...FilterText({ dataIndex: 'phone' })
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            width: '7%',
            type: 'select',
            optionSelect: [{ value: 'Nam', label: 'Nam' }, { value: 'Nữ', label: 'Nữ' }],
            editable: true,
            ...FilterSelect('gender', [{ value: 'Nam', text: 'Nam' }, { value: 'Nữ', text: 'Nữ' }])
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'activeStatus',
            width: '7%',
            editable: true,
            type: 'select',
            optionSelect: [{ value: true, label: 'Cho phép' }, { value: false, label: 'Chặn' }],
            ...FilterSelect('activeStatus', [{ value: 'Cho phép', text: 'Cho phép' }, { value: 'Chặn', text: 'Chặn' }])
        },
        ...(userType === 'admin' ? [{
            title: 'Quyền',
            dataIndex: 'userType',
            width: '7%',
            editable: true,
            type: 'select',
            optionSelect: Array.isArray(roles) ? roles.map((role) => ({ value: role._id, label: role.nameRole })) : [],
            ...(Array.isArray(roles) && roles.length > 0 ? FilterSelect('userType', roles.map(item => ({ text: item.nameRole, value: item._id }))) : {}),
        }] : []),
        {
            title: 'Ngày Tạo',
            dataIndex: 'createdAt',
            width: '7%',
            ...FilterDate({ dataIndex: 'createdAt' }),
            render: (data) => FormatDay(data)
        },
        ...(userType === 'admin' ? [{
            title: 'Khóa học',
            dataIndex: 'courseBuy',
            width: '6%',
            render: (text, record) =>
                <div className='flex justify-center'>
                    <Button type='primary' ghost
                        onClick={() => {
                            formCourses.setFieldsValue(record);
                            setOpenCourses(true);
                        }}
                    >
                        Khóa học
                    </Button>
                </div>
            ,
        }] : []),
    ];

    const columnsRole = [
        {
            title: 'Tên quyền',
            dataIndex: 'nameRole',
            width: '20%',
            editable: true,
            ...FilterText({ dataIndex: 'nameRole' }),
            render: (data) => <Typography.Text ellipsis={{ suffix: '' }}>{data}</Typography.Text>
        },
        {
            title: 'Quản lý',
            dataIndex: 'role',
            width: '40%',
            type: 'select-multi',
            optionSelect: [{ value: 'adminWebsite', label: 'Bài Viết' }, { value: 'adminCourses', label: 'Khóa Học' }, { value: 'adminOrders', label: 'Đơn Hàng' }, { value: 'adminFileManager', label: 'File' }],
            editable: true,
            ...FilterText({ dataIndex: 'name123' }),
            render: (role) => <>
                <FormatTag keywords={role} />
            </>,
        },
    ];

    const handleDelUser = (data) => {
        genericDispatch(dispatch, delUsersApi(data));
    }

    const handlePutUser = (data) => {
        data.activeStatus = data.activeStatus === 'Chặn' ? false : data.activeStatus === 'Cho phép' ? true : data.activeStatus;
        genericDispatch(dispatch, putUsersApi(data));
    };

    const handleAddRole = (data) => {
        genericDispatch(dispatch, addRoleApi(data), () => {
            setOpenRole(false);
            formRole.resetFields();
        });
    };

    const handlePutRole = (data) => {
        genericDispatch(dispatch, putRoleApi(data));
    };

    const handleDelRole = (data) => {
        genericDispatch(dispatch, delRoleApi(data));
    };

    const handlePutCourse = (data) => {
        data.id = data.key;
        genericDispatch(dispatch, putUsersApi(data));
    };

    useEffect(() => {
        if (loading === true) {
            dispatch(getUsersApi());
            dispatch(getRoleApi());
        }
    }, []);

    useEffect(() => {
        if (loadingCourses === true) {
            dispatch(getCourseApi());
        }
    }, []);

    return (
        <LayoutAdmin
            header={'NGƯỜI DÙNG'}
            button={
                <>
                    <Button onClick={() => setOpenRole(true)} type='primary'>Phân quyền</Button>
                    <Button onClick={() => exportDataExcel(users, 'Users.xlsx')} type='primary' >Xuất file Excel</Button>
                </>
            }
        >
            <Table
                loading={loading}
                data={data}
                columns={columns}
                onSave={handlePutUser}
                onDelete={handleDelUser}
            />

            <Modal
                centered
                open={openRole}
                onCancel={() => setOpenRole(false)}
                footer={null}
                width={750}
            >
                <Tabs
                    centered
                    items={[
                        {
                            label: 'Thêm quyền quản trị',
                            key: '1',
                            children:
                                <>
                                    <Form
                                        form={formRole}
                                        name="customForm"
                                        layout="vertical"
                                        onFinish={handleAddRole}
                                    >
                                        <Form.Item
                                            className='mb-3'
                                            name="nameRole"
                                            label='Tên quyền'
                                            rules={[{ required: true, message: 'Nhập tên quyền!' }]}
                                        >
                                            <Input
                                                placeholder='Nhập tên quyền'
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            className='mb-3'
                                            name="role"
                                            label='Chức năng quản lý'
                                            rules={[{ required: true, message: 'Chọn các quyền!' }]}
                                        >
                                            <TreeSelect
                                                treeDefaultExpandAll={true}
                                                showSearch={false}
                                                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                                                treeCheckable={true}
                                                treeData={[
                                                    {
                                                        title: 'Admin',
                                                        // value: '0-0',
                                                        // key: '0-0',
                                                        children: [
                                                            {
                                                                key: 'adminDashboard',
                                                                value: 'adminDashboard',
                                                                label: 'Trang chủ',
                                                            },
                                                            {
                                                                key: 'adminWebsite',
                                                                value: 'adminWebsite',
                                                                label: 'Bài Viết',
                                                            },
                                                            {
                                                                key: 'adminPlugins',
                                                                value: 'adminPlugins',
                                                                label: 'Plugins'
                                                            },
                                                            {
                                                                key: 'adminUsers',
                                                                value: 'adminUsers',
                                                                label: 'Người dùng'
                                                            },
                                                            {
                                                                key: 'adminWebsite',
                                                                value: 'adminCourses',
                                                                label: 'Khóa Học'
                                                            },
                                                            {
                                                                key: 'adminOrders',
                                                                value: 'adminOrders',
                                                                label: 'Đơn Hàng'
                                                            },
                                                            {
                                                                key: 'adminWebsite',
                                                                value: 'adminEmail',
                                                                label: 'Email'
                                                            },
                                                            {
                                                                key: 'adminFileManager',
                                                                value: 'adminFileManager',
                                                                label: 'File'
                                                            },
                                                            {
                                                                key: 'adminData',
                                                                value: 'adminData',
                                                                label: 'Dữ Liệu'
                                                            },
                                                            {
                                                                key: 'adminPayment',
                                                                value: 'adminPayment',
                                                                label: 'Key Thanh Toán'
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        title: 'User',
                                                        value: '0-1',
                                                        key: '0-1',
                                                        children: [
                                                            {
                                                                title: 'Trang chủ',
                                                                value: 'userDashboard',
                                                                key: 'userDashboard',
                                                            },
                                                            {
                                                                title: 'Thông tin',
                                                                value: 'userInfo',
                                                                key: 'userInfo',
                                                            },
                                                            {
                                                                title: 'Khóa học',
                                                                value: 'userCourses',
                                                                key: 'userCourses',
                                                            },
                                                            {
                                                                title: 'Lịch sử mua hàng',
                                                                value: 'userOrders',
                                                                key: 'userOrders',
                                                            },
                                                            {
                                                                title: 'Đổi mật khẩu',
                                                                value: 'userChangePassword',
                                                                key: 'userChangePassword',
                                                            },
                                                        ],
                                                    },
                                                ]}
                                                placeholder='Chọn các quyền'
                                            // [
                                            //     {
                                            //         value: 'adminWebsite',
                                            //         label: 'Bài Viết'
                                            //     },
                                            //     {
                                            //         value: 'adminPlugins',
                                            //         label: 'Plugins'
                                            //     },
                                            //     {
                                            //         value: 'adminUsers',
                                            //         label: 'Người dùng'
                                            //     },
                                            //     {
                                            //         value: 'adminCourses',
                                            //         label: 'Khóa Học'
                                            //     },
                                            //     {
                                            //         value: 'adminOrders',
                                            //         label: 'Đơn Hàng'
                                            //     },
                                            //     {
                                            //         value: 'adminEmail',
                                            //         label: 'Email'
                                            //     },
                                            //     {
                                            //         value: 'adminFileManager',
                                            //         label: 'File'
                                            //     },
                                            //     {
                                            //         value: 'adminData',
                                            //         label: 'Dữ Liệu'
                                            //     },
                                            //     {
                                            //         value: 'adminPayment',
                                            //         label: 'Key Thanh Toán'
                                            //     },
                                            // ]

                                            />
                                        </Form.Item>

                                        <Button type='primary' loading={loadingRoles} onClick={() => formRole.submit()} className='flex float-end'>Thêm quyền</Button>
                                    </Form>
                                </>
                            ,
                        },
                        {
                            label: 'Chỉnh sửa quyền quản trị',
                            key: '2',
                            children:
                                <>
                                    <Table
                                        loading={loadingRoles}
                                        data={dataRole}
                                        columns={columnsRole}
                                        scroll={{ x: 500, y: 350 }}
                                        width={'10%'}
                                        onSave={handlePutRole}
                                        onDelete={handleDelRole}
                                    />
                                </>
                            ,
                        },
                    ]}
                />
            </Modal>

            <Modal
                title=<>Khóa học của học viên: <Typography.Text type='danger'>{formCourses.getFieldValue('name')}</Typography.Text></>
                centered
                open={openCourses}
                onOk={() => {
                    formCourses.submit();
                }}
                onCancel={() => {
                    setOpenCourses(false);
                    formCourses.resetFields();
                }}
                confirmLoading={loading}
                width={600}
            >
                <Form
                    form={formCourses}
                    name="customFormCourses"
                    layout="vertical"
                    onFinish={handlePutCourse}
                >
                    <Form.Item
                        className='mb-4 hidden'
                        name="key"
                        label="Khóa học"
                        rules={[{ required: true, message: 'Chọn khóa học cần kích hoạt!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        className='mb-4'
                        name="courses"
                        label="Kích hoạt khóa học"
                    >
                        <Select
                            mode='multiple'
                            options={dataCourses}
                            placeholder='Chọn khóa học cần kích hoạt'
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </LayoutAdmin>
    )
}

export default User