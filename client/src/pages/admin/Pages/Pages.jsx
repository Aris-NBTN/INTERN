import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Input, Modal, Typography, Form, Tabs, Tooltip } from 'antd';
import { NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { toastError } from '~/components/toast';
import LayoutAdmin from '~/components/layout/admin/Layout'
import Table from '~/components/table/Table';
import { FilterSelect, FilterText } from '~/components/table/Filter';
import { FindNameById, FormatTag } from '~/components/table/Format';

import { FaCopy, FaEye } from 'react-icons/fa';
import { FaFilePen } from 'react-icons/fa6';

import { exportDataExcel } from '~/utils/export';

import { genericDispatch } from '~/redux/utils';
import { useDispatch, useSelector } from 'react-redux';
import { getPageApi, addPageApi, delPageApi, putPageApi, copyPageApi } from '~/redux/slices/Data/pagesSlice';
import { getGroupApi, addGroupApi, delGroupApi, putGroupApi } from '~/redux/slices/Data/groupPageSlice';

const Pages = () => {
    const dispatch = useDispatch();
    const isMobile = useMediaQuery({ query: '(max-width: 576px)' });

    const [formAddPage] = Form.useForm();
    const [formAddCategory] = Form.useForm();

    const { pages, loading } = useSelector((state) => state.pages);
    const { groupPages, loading: loadingGroup } = useSelector((state) => state.groupPages);

    const [openAddPage, setOpenAddPage] = useState(false);
    const [openAddCategory, setOpenAddCategory] = useState(false);

    const dataPages = useMemo(() =>
        pages.map((page) => ({
            ...page,
            key: page._id,
        })),
        [pages]
    );

    const dataGroup = useMemo(() =>
        groupPages.map((groupPage) => ({
            ...groupPage,
            key: groupPage._id,
        })),
        [groupPages]
    );

    // Column
    const columns = [
        {
            title: 'Tên trang',
            dataIndex: 'name',
            width: '15%',
            editable: true,
            ellipsis: {
                showTitle: true,
            },
            ...FilterText({ dataIndex: 'name' }),
        },
        {
            title: 'Link Trang',
            dataIndex: 'slug',
            width: '15%',
            editable: false,
            ellipsis: {
                showTitle: true,
            },
            ...FilterText({ dataIndex: 'slug' }),
            render: (slug) => <>
                <Typography.Paragraph
                    className='!mb-0'
                    ellipsis={{ suffix: '' }}
                    copyable={{
                        text: `/${slug}`,
                    }}
                >
                    {slug}
                </Typography.Paragraph>
            </>

        },
        {
            title: 'Tiêu đề trang',
            dataIndex: 'title',
            width: '15%',
            editable: true,
            ...FilterText({ dataIndex: 'title' })
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: '15%',
            editable: true,
            ...FilterText({ dataIndex: 'description' })
        },
        {
            title: 'Từ khóa',
            dataIndex: 'keywords',
            width: '15%',
            type: 'tag',
            editable: true,
            render: (keywords) => <FormatTag keywords={keywords} />
        },
        {
            title: 'Nhóm',
            dataIndex: 'group',
            width: '8%',
            type: 'select',
            editable: true,
            optionSelect: Array.isArray(groupPages) && groupPages.length > 0 ? groupPages?.map(item => ({ label: item.group, value: item._id })) : [],
            render: (group) => (group && groupPages && Array.isArray(groupPages) && groupPages.length > 0) ? FindNameById(group, groupPages, 'group') : null,
            ...(Array.isArray(groupPages) && groupPages.length > 0 ? FilterSelect('group', groupPages.map(item => ({ text: item.group, value: item._id }))) : {}),
        },
    ];

    const columnsCategory = [
        {
            title: 'Tên nhóm',
            dataIndex: 'group',
            width: '60%',
            type: 'text',
            editable: true,
            ...FilterText({ dataIndex: 'group' })
        },
    ];

    // Pages
    const handleAddPage = (data) => {
        genericDispatch(dispatch, addPageApi(data),
            () => {
                setOpenAddPage(false);
                formAddPage.resetFields();
            }
        );
    };

    const handlePutPage = (data) => {
        genericDispatch(dispatch, putPageApi(data))
    };

    const handleDelPage = (data) => {
        genericDispatch(dispatch, delPageApi(data))
    }

    // Group
    const handleAddGroup = (data) => {
        genericDispatch(dispatch, addGroupApi(data),
            () => {
                setOpenAddCategory(false);
                formAddCategory.resetFields();
            }
        );
    };

    const handlePutGroup = (data) => {
        genericDispatch(dispatch, putGroupApi(data))
    };

    const handleDelGroup = (data) => {
        genericDispatch(dispatch, delGroupApi(data))
    };

    useEffect(() => {
        if (loading === true) {
            dispatch(getPageApi());
        }
    }, []);

    useEffect(() => {
        if (loadingGroup === true) {
            dispatch(getGroupApi());
        }
    }, []);

    return (
        <LayoutAdmin
            header={'BÀI VIẾT'}
            button={
                <>
                    <Button type='primary' onClick={() => setOpenAddCategory(true)}>Thêm nhóm</Button>
                    <Button type='primary' onClick={() => setOpenAddPage(true)}>Thêm trang</Button>
                    {/* <Button onClick={() => exportDataExcel(data, 'Pages.xlsx')} type='primary'>Xuất file Excel</Button> */}
                </>
            }
        >
            <Table
                loading={loading}
                data={dataPages}
                columns={columns}
                onSave={handlePutPage}
                onDelete={handleDelPage}
                width={'12%'}
                button={(record) =>
                    <>
                        <Tooltip title='Xem trang'>
                            <NavLink to={record.slug === "trang-chu" ? "/" : `/${record.slug}`} target='_blank'>
                                <FaEye size={22} color='#006aff' />
                            </NavLink>
                        </Tooltip>

                        <Tooltip title='Sao chép trang'>
                            <Typography onClick={() => genericDispatch(dispatch, copyPageApi(record._id))} >
                                <FaCopy size={22} color='#55ff00' />
                            </Typography>
                        </Tooltip>

                        {isMobile ?
                            <>
                                <Tooltip title='Chỉnh sửa trang'>
                                    <Typography.Link onClick={() => toastError('', 'Bạn không thể truy cập trang này!', 'Vui lòng sử dụng máy tính để trãi nghiệm tốt nhất!')}>
                                        <FaFilePen size={22} color='rgb(255 127 0)' />
                                    </Typography.Link>
                                </Tooltip>
                            </>
                            : (
                                <Tooltip title='Chỉnh sửa trang'>
                                    <a href={`/admin/page/${record.slug}`}>
                                        <FaFilePen size={22} color='rgb(255 127 0)' />
                                    </a>
                                </Tooltip>
                            )}
                    </>
                }
            />

            {/* Pages */}
            <Modal
                title='Thêm trang'
                centered
                open={openAddPage}
                onOk={() => formAddPage.submit()}
                onCancel={() => setOpenAddPage(false)}
                confirmLoading={loading}
                width={500}
            >
                <Form
                    form={formAddPage}
                    name="customForm"
                    layout="vertical"
                    onFinish={handleAddPage}
                >
                    <Form.Item
                        label='Tên trang'
                        className='mb-2'
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên trang!' }]}
                    >
                        <Input
                            className='mb-2'
                            placeholder='Nhập tên trang'
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Group */}
            <Modal
                centered
                open={openAddCategory}
                confirmLoading={loadingGroup}
                onOk={() => formAddCategory.submit()}
                onCancel={() => setOpenAddCategory(false)}
                footer={null}
                width={600}
            >
                <Tabs
                    centered
                    items={[
                        {
                            label: 'Thêm nhóm',
                            key: '1',
                            children:
                                <>
                                    <Form
                                        form={formAddCategory}
                                        name="customForm"
                                        layout="vertical"
                                        onFinish={handleAddGroup}
                                    >
                                        <Form.Item
                                            className='mb-3'
                                            name="group"
                                            label='Tên nhóm'
                                            rules={[{ required: true, message: 'Nhập tên nhóm!' }]}
                                        >
                                            <Input placeholder="Nhập nhóm" />
                                        </Form.Item>

                                        <Button type='primary' loading={loadingGroup} onClick={() => formAddCategory.submit()} className='flex float-end'>Thêm nhóm</Button>
                                    </Form>
                                </>
                            ,
                        },
                        {
                            label: 'Chỉnh sửa nhóm',
                            key: '2',
                            children:
                                <>
                                    <Table
                                        loading={loadingGroup}
                                        data={dataGroup}
                                        isScroll={false}
                                        columns={columnsCategory}
                                        width={'10%'}
                                        onSave={handlePutGroup}
                                        onDelete={handleDelGroup}
                                    />
                                </>
                            ,
                        },
                    ]}
                />
            </Modal>
        </LayoutAdmin>
    )
}

export default Pages