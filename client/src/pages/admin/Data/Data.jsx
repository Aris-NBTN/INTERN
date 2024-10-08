import { Button, Card, Col, Modal, Row, Form, Typography, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LayoutAdmin from '~/components/layout/Admin/Layout'
import { toastError, toastLoading, toastSuccess } from '~/components/toast';
import { getFileInFolderApi } from '~/redux/slices/Data/restoreSlice';
import { dataApi } from '~/apis/dataApi';

const Data = () => {
    const dispatch = useDispatch();

    const [openRestore, setOpenRestore] = useState(false);
    const [restoreInfo, setRestoreInfo] = useState(null);
    const [formRestore] = Form.useForm();

    const handleRestore = (data) => {
        const dataRestore = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => value !== undefined)
        );
        if (Object.keys(dataRestore).length > 0) {
            toastLoading('restore', 'Đang Khôi Phục Dữ Liệu...');
            dataApi
                .restore({ collections: dataRestore })
                .then(() => {
                    toastSuccess('restore', 'Khôi Phục Dữ Liệu Thành Công!', 'Dữ liệu đã được khôi phục lại!');
                    formRestore.resetFields();
                    setOpenRestore(false);
                })
                .catch(() => {
                    toastError('restore', 'Khôi Phục Dữ Liệu Thất Bại!', 'Vui lòng thử lại sau!');
                })
        } else {
            toastError('restore', 'Khôi Phục Dữ Liệu Thất Bại!', 'Vui lòng chọn ít nhất 1 bản ghi cần khôi phục!');
        }
    }

    const { restore, loading } = useSelector(state => state.restore);
    const dataBackup = useMemo(() =>
        restore?.newData?.children.map((data) => ({
            label: data.name,
            value: data.name
        })),
        [restore]
    );

    useEffect(() => {
        if (loading) {
            dispatch(getFileInFolderApi({ folderName: "uploads/backup" }));
        }
    }, [])

    return (
        <LayoutAdmin title={'Dữ liệu'} header={'DỮ LIỆU'}>
            <Card
                className='h-full'
                title=<>
                    Khôi phục dữ liệu <Typography.Link className='text-base'>data</Typography.Link>
                </>
            >
                <Row gutter={[24, 24]}>
                    <Col xl={{ span: 8 }} lg={{ span: 12 }} span='24'>
                        <Card className='h-full'>
                            <div className="flex flex-wrap justify-between items-center">
                                <Typography.Title level={5} className='!my-0'>Khôi phục dữ liệu Website</Typography.Title>
                                <Button type="primary" onClick={() => {
                                    setOpenRestore(true);
                                    setRestoreInfo('website');
                                }}> Khôi phục</Button>
                            </div>
                        </Card>
                    </Col>

                    <Col xl={{ span: 8 }} lg={{ span: 12 }} span='24'>
                        <Card className='h-full'>
                            <div className="flex flex-wrap justify-between items-center">
                                <Typography.Title level={5} className='!my-0'>Khôi phục dữ liệu người dùng</Typography.Title>
                                <Button type="primary" onClick={() => {
                                    setOpenRestore(true);
                                    setRestoreInfo('users');
                                }}> Khôi phục</Button>
                            </div>
                        </Card>
                    </Col>

                    <Col xl={{ span: 8 }} lg={{ span: 12 }} span='24'>
                        <Card className='h-full'>
                            <div className="flex flex-wrap justify-between items-center">
                                <Typography.Title level={5} className='!my-0'>Khôi phục dữ liệu khóa học</Typography.Title>
                                <Button type="primary" onClick={() => {
                                    setOpenRestore(true);
                                    setRestoreInfo('courses');
                                }}> Khôi phục</Button>
                            </div>
                        </Card>
                    </Col>

                    <Col xl={{ span: 8 }} lg={{ span: 12 }} span='24'>
                        <Card className='h-full'>
                            <div className="flex flex-wrap justify-between items-center">
                                <Typography.Title level={5} className='!my-0'>Khôi phục dữ liệu đơn hàng</Typography.Title>
                                <Button type="primary" onClick={() => {
                                    setOpenRestore(true);
                                    setRestoreInfo('orders');
                                }}> Khôi phục</Button>
                            </div>
                        </Card>
                    </Col>

                    <Col xl={{ span: 8 }} lg={{ span: 12 }} span='24'>
                        <Card className='h-full'>
                            <div className="flex flex-wrap justify-between items-center">
                                <Typography.Title level={5} className='!my-0'>Khôi phục khác</Typography.Title>
                                <Button type="primary" onClick={() => {
                                    setOpenRestore(true);
                                    setRestoreInfo('others');
                                }}> Khôi phục</Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Card>

            <Modal
                title="Chọn bản ghi cần khôi phục"
                centered
                open={openRestore}
                onOk={() => formRestore.submit()}
                onCancel={() => setOpenRestore(false)}
            >
                <Form
                    form={formRestore}
                    name="customRes"
                    layout="vertical"
                    onFinish={handleRestore}
                >
                    {restoreInfo == 'website' ? (
                        <>
                            <Form.Item
                                label='Thông tin website'
                                className='mb-2'
                                name="infos"

                            >
                                <Select
                                    showSearch
                                    options={dataBackup}
                                    placeholder='Chọn bản khôi phục'
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label='Danh sách bài viết'
                                className='mb-2'
                                name="pages"
                            >
                                <Select
                                    showSearch
                                    options={dataBackup}
                                    placeholder='Chọn bản khôi phục'
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label='Danh sách nhóm bài viết'
                                className='mb-2'
                                name="grouppages"
                            >
                                <Select
                                    showSearch
                                    options={dataBackup}
                                    placeholder='Chọn bản khôi phục'
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label='Bố cục (Header - Footer)'
                                className='mb-2'
                                name="layouts"
                            >
                                <Select
                                    showSearch
                                    options={dataBackup}
                                    placeholder='Chọn bản khôi phục'
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </>
                    ) : restoreInfo == 'courses' ? (
                        <>
                            <Form.Item
                                label='Danh sách khóa học'
                                className='mb-2'
                                name="courses"
                            >
                                <Select
                                    showSearch
                                    options={dataBackup}
                                    placeholder='Chọn bản khôi phục'
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label='Danh mục khóa học'
                                className='mb-2'
                                name="categorycourses"
                            >
                                <Select
                                    showSearch
                                    options={dataBackup}
                                    placeholder='Chọn bản khôi phục'
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </>
                    ) : restoreInfo == 'users' ? (
                        <>
                            <Form.Item
                                label='Danh sách người dùng'
                                className='mb-2'
                                name="users"
                            >
                                <Select
                                    showSearch
                                    options={dataBackup}
                                    placeholder='Chọn bản khôi phục'
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label='Phân quyền'
                                className='mb-2'
                                name="roles"
                            >
                                <Select
                                    showSearch
                                    options={dataBackup}
                                    placeholder='Chọn bản khôi phục'
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </>
                    ) : restoreInfo == 'orders' ? (
                        <>
                            <Form.Item
                                label='Key thanh toán'
                                className='mb-2'
                                name="keybanks"
                            >
                                <Select
                                    showSearch
                                    options={dataBackup}
                                    placeholder='Chọn bản khôi phục'
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label='Danh sách đơn hàng'
                                className='mb-2'
                                name="orders"
                            >
                                <Select
                                    showSearch
                                    options={dataBackup}
                                    placeholder='Chọn bản khôi phục'
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </>
                    ) : (
                        <>
                            <Form.Item
                                label='Danh sách plugins'
                                className='mb-2'
                                name="plugins"

                            >
                                <Select
                                    showSearch
                                    options={dataBackup}
                                    placeholder='Chọn bản khôi phục'
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label='Cài đặt'
                                className='mb-2'
                                name="settings"
                            >
                                <Select
                                    disabled
                                    showSearch
                                    options={dataBackup}
                                    placeholder='Chọn bản khôi phục'
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
        </LayoutAdmin>
    )
}

export default Data