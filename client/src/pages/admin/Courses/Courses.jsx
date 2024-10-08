import { Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Tabs, Tag, theme, Tooltip, Typography } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import LayoutAdmin from '~/components/layout/Admin/Layout'
import Table from '~/components/table/Table';

import { FilterText, FilterDate, FilterSorter, FilterSelect } from '~/components/table/Filter';
import { FindNameById, FormatDay, FormatDayTime, FormatPerCennt, FormatPrice } from '~/components/table/Format';

import { genericDispatch } from '~/redux/utils';
import { useDispatch, useSelector } from 'react-redux';
import { addCourseApi, getCourseApi, delCourseApi, putCourseApi, putOrderCourseApi } from '~/redux/slices/Data/coursesSlice';
import { addCategoryCouresApi, getCategoryCouresApi, delCategoryCouresApi, putCategoryCouresApi } from '~/redux/slices/Data/categoryCourseSlice';

import { exportDataExcel } from '~/utils/export';
import { MdSlowMotionVideo } from "react-icons/md";
import FileAntd from '~/components/upload/FileAntd';
import { baseURL } from '~/utils/index'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

let index = 0;

const Courses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formAddCourse] = Form.useForm();
    const [formAddCategory] = Form.useForm();
    const [formInfo] = Form.useForm();
    const [form] = Form.useForm();

    const { token: { colorPrimary } } = theme.useToken();

    const price = Form.useWatch('price', formAddCourse);
    const sale = Form.useWatch('sale', formAddCourse);
    const [drag, setDrag] = useState(localStorage.getItem('drag') === 'true' ? true : false);
    const inputRef = useRef(null);

    // Modal
    const [openInFor, setOpenInFor] = useState(false);
    const [openCourse, setOpenCourse] = useState(false);
    const [openCategory, setOpenCategory] = useState(false);

    // const [info, setInfo] = useState('');

    const [items, setItems] = useState([]);
    const [svgCodes, setSvgCodes] = useState({});

    // Data
    const { courses, loading: loadingCourses } = useSelector((state) => state.courses);
    const { categoryCourses: category, loading: loadingCategory } = useSelector((state) => state.categoryCourses);
    const categories = category?.newData;

    const dataCourses = useMemo(() =>
        courses?.newData?.map((course) => ({
            ...course,
            key: course._id,
        })),
        [courses]
    );

    const dataCategoryCourse = useMemo(() =>
        categories?.map((category) => ({
            ...category,
            key: category._id,
        })),
        [categories]
    );

    const addItem = (values) => {
        const { name, svgCode } = values;
        const newItem = name || `New item ${index++}`;
        setItems([...items, newItem]);
        setSvgCodes({ ...svgCodes, [newItem]: svgCode }); // Lưu mã SVG cho item mới
        form.resetFields();
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    // Column
    const columnsCourse = [
        {
            title: 'Tên khóa học',
            dataIndex: 'name',
            width: '15%',
            type: 'text',
            editable: true,
            ellipsis: {
                showTitle: true,
            },
            ...FilterText({ dataIndex: 'name' }),
            render: (name) => (
                <Tooltip placement="top" title={name}>
                    {name}
                </Tooltip>
            ),
        },
        {
            title: 'Link',
            dataIndex: 'slug',
            width: '8%',
            type: 'text',
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
                        text: `/course/${slug}`,
                    }}
                >
                    {slug}
                </Typography.Paragraph>
            </>
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            width: '10%',
            type: 'select',
            editable: true,
            optionSelect: Array.isArray(categories) && categories?.length > 0 ? categories?.map(item => ({ label: item.category, value: item._id })) : [],
            ...(Array.isArray(categories) && categories?.length > 0 ? FilterSelect('category', categories?.map(item => ({ text: item.category, value: item._id }))) : {}),
            render: (category) => (category && categories && Array.isArray(categories) && categories?.length > 0) ? FindNameById(category, categories, 'category') : null,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            width: '8%',
            type: 'price',
            editable: true,
            ...FilterSorter({ dataIndex: 'price', type: 'number' }),
            render: (price) => FormatPrice(price),
        },
        {
            title: 'Giảm',
            dataIndex: 'sale',
            width: '5%',
            type: 'percent',
            editable: true,
            ...FilterSorter({ dataIndex: 'sale', type: 'number' }),
            render: (sale) => FormatPerCennt(sale),
        },
        {
            title: 'Trang thái',
            dataIndex: 'status',
            width: '8%',
            type: 'select',
            optionSelect: [{ label: 'Đang bán', value: 'Đang bán' }, { label: 'Chưa bán', value: 'Chưa bán' }],
            editable: true,
            ...FilterSelect('status', [{ value: 'Đang bán', text: 'Đang bán' }, { value: 'Chưa bán', text: 'Chưa bán' }])
        },
        {
            title: 'Sao',
            dataIndex: 'star',
            width: '6%',
            type: 'select',
            optionSelect: [{ label: '3', value: '3' }, { label: '4', value: '4' }, { label: '4.5', value: '4.5' }, { label: '5', value: '5' }],
            editable: true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: '8%',
            ...FilterDate({ dataIndex: 'createdAt' }),
            render: (dayCreate) => FormatDay(dayCreate),
        },
        {
            title: 'Cập nhập',
            dataIndex: 'updatedAt',
            width: '8%',
            render: (updatedAt) => FormatDayTime(updatedAt),
        },
        {
            title: 'Thông tin',
            dataIndex: 'info',
            width: '7%',
            render: (text, record) =>
                <div className='flex justify-center'>
                    <Button type='primary' ghost onClick={() => {
                        formInfo.setFieldsValue(record);
                        setOpenInFor(true);
                    }}
                    >
                        Thông tin
                    </Button>
                </div>
            ,
        },
    ];

    const columnsCategory = [
        {
            title: 'Tên danh mục',
            dataIndex: 'category',
            width: '70%',
            type: 'text',
            editable: true,
            ...FilterText({ dataIndex: 'category' })
        },
    ];

    // Course
    const handleAddCourse = (data) => {
        genericDispatch(dispatch, addCourseApi(data),
            () => {
                setOpenCourse(false);
                formAddCourse.resetFields();
            }
        );
    };

    const handlePutCourse = (data) => {
        genericDispatch(dispatch, putCourseApi(data));
    };

    const handlePutInfo = (data) => {
        data.id = data.key;
        genericDispatch(dispatch, putCourseApi(data),
            () => {
                setOpenInFor(false);
                formInfo.resetFields();
            }
        );
    };

    const handleDelCourse = (data) => {
        genericDispatch(dispatch, delCourseApi(data));
    }

    // Category
    const handleAddCategory = (data) => {
        genericDispatch(dispatch, addCategoryCouresApi(data), () => {
            setOpenCategory(false);
            formAddCategory.resetFields()
        });
    };

    const handlePutCategory = (data) => {
        genericDispatch(dispatch, putCategoryCouresApi(data))
    };

    const handleDelCategory = (data) => {
        genericDispatch(dispatch, delCategoryCouresApi(data));
    }

    useEffect(() => {
        if (loadingCourses) {
            dispatch(getCourseApi({ page: 1, limit: localStorage.getItem('pageSize') || 10 }));
        }
    }, []);

    useEffect(() => {
        if (loadingCategory) {
            dispatch(getCategoryCouresApi());
        }
    }, []);

    useEffect(() => {
        const handleCalculatePriceSale = () => {
            const price = formAddCourse.getFieldValue('price') || 0;
            const sale = formAddCourse.getFieldValue('sale') || 0;
            const priceSale = price - (price * sale) / 100;
            formAddCourse.setFieldsValue({
                priceSale: priceSale >= 0 ? priceSale : 0,
            });
        };

        handleCalculatePriceSale()
    }, [price, sale]);

    return (
        <LayoutAdmin
            title={'Khóa học'}
            header={
                <>
                    <div className='flex items-center'>
                        <h6 className='mb-0'>KHÓA HỌC</h6>
                    </div>
                </>
            }
            button={
                <>
                    {drag ?
                        <Button onClick={() => {
                            setDrag(false);
                            localStorage.setItem('drag', 'false');
                        }}>
                            <Typography>Tắt sắp xếp</Typography>
                        </Button>
                        :
                        <Button type='primary' onClick={() => {
                            setDrag(true);
                            localStorage.setItem('drag', 'true');
                        }}>
                            Bật sắp xếp
                        </Button>}

                    <Button type='primary' onClick={() => { setOpenCategory(true) }}> Thêm danh mục</Button>
                    <Button type='primary' onClick={() => setOpenCourse(true)}>Thêm khóa học</Button>
                    <Button onClick={() => exportDataExcel(dataCourses, 'Course.xlsx')} type='primary'>Xuất file Excel</Button>
                </>
            }
        >
            <Table
                ApiPut={putOrderCourseApi}
                Api={getCourseApi}
                dragMode={drag}
                total={courses?.totalPages}
                loading={loadingCourses}
                data={dataCourses}
                columns={columnsCourse}
                onSave={handlePutCourse}
                onDelete={handleDelCourse}
                button={(record) => (
                    <div className='flex gap-3'>
                        <MdSlowMotionVideo onClick={() => {
                            navigate(`/admin/course/${record._id}`);
                            localStorage.setItem('name-course', record.name);
                        }}
                            size={20} color='red'
                        />
                    </div>
                )}
            />

            {/* Infor */}
            <Modal
                title=<>  Thông tin khóa học: <Typography.Text type='danger'>{formInfo.getFieldValue('name')}</Typography.Text> </>
                centered
                open={openInFor}
                maskClosable={false}
                onOk={() => formInfo.submit()}
                onCancel={() => {
                    setOpenInFor(false);
                    formInfo.resetFields();
                }}
                confirmLoading={loadingCourses}
                width={800}
            >
                <Form
                    form={formInfo}
                    name="customForm"
                    layout="vertical"
                    onFinish={handlePutInfo}
                >
                    <Form.Item
                        className='mb-0 hidden'
                        name="key"
                    >
                        <Input
                            className='mb-2'
                        />
                    </Form.Item>

                    <Form.Item
                        className='mb-2'
                        name="title"
                        label="Tiêu đề"
                    >
                        <Input
                            size='large'
                            className='mb-2'
                            placeholder='Nhập tiêu đề'
                        />
                    </Form.Item>

                    <Form.Item
                        className='mb-2'
                        name="prerequisite"
                        label="Điều kiện tiên quyết"
                    >
                        <Select
                            size='large'
                            className='w-full mb-2'
                            placeholder='Chọn & nhập điều kiện tiên quyết'
                            mode="tags"

                        />
                    </Form.Item>

                    <Form.Item
                        className='mb-2'
                        name="customer"
                        label="Đối tượng khách hàng"
                    >
                        <Select
                            size='large'
                            className='w-full mb-2'
                            placeholder='Chọn & nhập đối tượng khách hàng'
                            mode="tags"

                        />
                    </Form.Item>

                    <Form.Item
                        className='mb-2'
                        name="output"
                        label="Tiêu chí đầu ra"
                    >
                        <Select
                            size='large'
                            className='w-full mb-2'
                            placeholder='Chọn & nhập tiêu chí đầu ra'
                            mode="tags"


                        />
                    </Form.Item>

                    <Form.Item
                        className='mb-2'
                        name="benefit"
                        label="Lợi ích từ khóa học"
                    >
                        <Select
                            size='large'
                            className='w-full mb-2'
                            placeholder='Chọn & nhập lợi ích'
                            mode="tags"


                        />
                    </Form.Item>

                    <Form.Item
                        className='mb-2'
                        name="includes"
                        label="Khóa học bao gồm"
                    >
                        <Select
                            size='large'
                            mode='multiple'
                            placeholder="Chọn & nhập thông tin"
                            tagRender={(props) => {
                                const { value, closable, onClose } = props;
                                if (value !== undefined) {
                                    const data = JSON.parse(value);
                                    return (
                                        <Tag
                                            style={{ height: 32, marginInlineEnd: 4 }}
                                            closable={closable}
                                            onClose={onClose}
                                            className='flex items-center'
                                        >
                                            <div className="flex">
                                                {data.svgCode ? (
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: data.svgCode }}
                                                        style={{ width: '20px', marginRight: '8px' }}
                                                    />
                                                ) : null}
                                                {data.name}
                                            </div>
                                        </Tag>
                                    );
                                }
                            }}
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider
                                        style={{
                                            margin: '8px 0',
                                        }}
                                    />

                                    <Form form={form} onFinish={addItem} layout="vertical">
                                        <div className="flex gap-2 mb-2">
                                            <Form.Item
                                                name="name"
                                                className='!mb-0'
                                                rules={[{ required: true, message: 'Nhập thông tin!' }]}
                                            >
                                                <Input
                                                    style={{ width: 200 }}
                                                    placeholder="Nhập thông tin"
                                                    ref={inputRef}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                name="svgCode"
                                                className='!mb-0'
                                                rules={[{ required: true, message: 'Nhập SVG icon!' }]}
                                            >
                                                <Input
                                                    style={{ width: 200 }}
                                                    placeholder="Nhập mã SVG icon"
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />
                                            </Form.Item>

                                            <Button
                                                className="w-full"
                                                type="primary"
                                                ghost
                                                htmlType="submit"
                                            >
                                                Thêm thông tin
                                            </Button>
                                        </div>
                                    </Form>
                                </>
                            )}
                            options={items.map((item) => ({
                                label: (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {svgCodes[item] && (
                                            <div
                                                dangerouslySetInnerHTML={{ __html: svgCodes[item] }}
                                                style={{ width: '20px', marginRight: '8px' }}
                                            />
                                        )}
                                        {item}
                                    </div>
                                ),
                                value: JSON.stringify({ name: item, svgCode: svgCodes[item] || '' }),
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        className='mb-2'
                        name="hidden"
                        label="Ẩn thông tin"
                    >
                        <Select
                            size='large'
                            className='w-full mb-2'
                            placeholder='Chọn thông tin cần ẩn'
                            mode="multiple"
                            options={[
                                {
                                    label: 'Lợi ích từ khóa học',
                                    value: 'benefit'
                                },
                                {
                                    label: 'Yêu cầu khóa học',
                                    value: 'prerequisite'
                                },
                                {
                                    label: 'Đối tượng khách hàng',
                                    value: 'customer'
                                },
                                {
                                    label: 'Tiêu chí đầu ra',
                                    value: 'output'
                                },
                                {
                                    label: 'Nội dung khóa học',
                                    value: 'module'
                                },
                                {
                                    label: 'Đánh giá từ học viên',
                                    value: 'review'
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        className='mb-0 hidden'
                        name="seo"
                    >
                        <Input className='mb-2' />
                    </Form.Item>

                    <div className="flex flex-wrap md:flex-nowrap mt-2 gap-2 justify-center">
                        <Form.Item
                            className='mb-2'
                            label="Ảnh bìa"
                        >
                            <FileAntd
                                apiUpload={`${baseURL}/v1/courser/image`}
                                name='img'
                                body={formInfo?.getFieldValue('_id')}
                                fileLists={`${formInfo?.getFieldValue('img')}`}
                                limit={1}
                            />
                        </Form.Item>

                        <Form.Item
                            className='mb-2'
                            label="Ảnh chi tiết"
                        >
                            <FileAntd
                                apiUpload={`${baseURL}/v1/courser/image`}
                                name='imgDetail'
                                body={formInfo.getFieldValue('_id')}
                                fileLists={`${formInfo.getFieldValue('imgDetail')}`}
                                limit={1}
                            />
                        </Form.Item>

                        <Form.Item
                            className='w-full mb-2'
                            name="description"
                            label=" Mô tả"
                        >
                            <Input.TextArea
                                size='large'
                                className='mb-2'
                                placeholder="Nhập mô tả"
                                style={{
                                    height: 100,
                                    resize: 'none'
                                }}
                            />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            {/* Course */}
            <Modal
                title="Khóa học"
                centered
                open={openCourse}
                onOk={() => formAddCourse.submit()}
                onCancel={() => setOpenCourse(false)}
                confirmLoading={loadingCourses}
                width={600}
            >
                <Form
                    form={formAddCourse}
                    name="customForm"
                    layout="vertical"
                    onFinish={handleAddCourse}
                >
                    <Form.Item
                        className='mb-2'
                        name="name"
                        label="Tên khóa học"
                        rules={[{ required: true, message: 'Nhập tên khóa học!' }]}
                    >
                        <Input placeholder="Nhập tên khóa học" />
                    </Form.Item>

                    <Row gutter={[14, 14]}>
                        <Col span={8}>
                            <Form.Item
                                className='mb-2'
                                name="category"
                                label="Danh mục"
                                rules={[{ required: true, message: 'Chọn danh mục!' }]}
                            >
                                <Select
                                    options={
                                        categories?.map(item => ({
                                            label: item.category,
                                            value: item._id
                                        }))
                                    }
                                    placeholder="Chọn danh mục"
                                >
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                className='mb-2'
                                name="status"
                                label="Trạng thái"
                                rules={[{ required: true, message: 'Chọn trạng thái!' }]}
                            >
                                <Select placeholder="Chọn trạng thái">
                                    <Select.Option value="Đang bán">Đang bán</Select.Option>
                                    <Select.Option value="Chưa bán">Chưa bán</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                className='mb-2'
                                name="star"
                                label="Số sao"
                                rules={[{ required: true, message: 'Chọn số sao!' }]}
                            >
                                <Select
                                    placeholder="Chọn trạng thái">
                                    <Select.Option value="3">
                                        <div className="flex">
                                            <FaStar color={colorPrimary} />
                                            <FaStar color={colorPrimary} />
                                            <FaStar color={colorPrimary} />
                                            <FaRegStar color={colorPrimary} />
                                            <FaRegStar color={colorPrimary} />
                                        </div>
                                    </Select.Option>
                                    <Select.Option value="4">
                                        <div className="flex">
                                            <FaStar color={colorPrimary} />
                                            <FaStar color={colorPrimary} />
                                            <FaStar color={colorPrimary} />
                                            <FaStar color={colorPrimary} />
                                            <FaRegStar color={colorPrimary} />
                                        </div>
                                    </Select.Option>
                                    <Select.Option value="4.5">
                                        <div className="flex">
                                            <FaStar color={colorPrimary} />
                                            <FaStar color={colorPrimary} />
                                            <FaStar color={colorPrimary} />
                                            <FaStar color={colorPrimary} />
                                            <FaStarHalfAlt color={colorPrimary} />
                                        </div>
                                    </Select.Option>
                                    <Select.Option value="5">
                                        <div className="flex">
                                            <FaStar color={colorPrimary} />
                                            <FaStar color={colorPrimary} />
                                            <FaStar color={colorPrimary} />
                                            <FaStar color={colorPrimary} />
                                            <FaStar color={colorPrimary} />
                                        </div>
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[14, 14]}>
                        <Col span={8}>
                            <Form.Item
                                className='mb-0'
                                name="price"
                                label="Giá tiền VN"
                                rules={[{ required: true, message: 'Nhập giá tiền!' }]}
                            >
                                <InputNumber
                                    className='w-full mb-2'
                                    placeholder='Nhập giá tiền'
                                    min={0}
                                    step={100000}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                className='mb-0'
                                name="sale"
                                label="Giảm giá %"
                                rules={[{ required: true, message: 'Nhập %!' }]}
                            >
                                <InputNumber
                                    className='w-full mb-2'
                                    placeholder='Nhập %'
                                    min={0}
                                    max={100}
                                    step={5}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                className='mb-0'
                                label="Giá sau khi giảm"
                                name='priceSale'
                            >
                                <InputNumber
                                    className='w-full mb-2'
                                    placeholder='Giá sau khi giảm'
                                    readOnly
                                    min={0}
                                    step={100000}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* Category */}
            <Modal
                centered
                open={openCategory}
                onCancel={() => setOpenCategory(false)}
                footer={null}
                width={600}
            >
                <Tabs
                    centered
                    items={[
                        {
                            label: 'Thêm danh mục',
                            key: '1',
                            children:
                                <>
                                    <Form
                                        form={formAddCategory}
                                        name="customForm"
                                        layout="vertical"
                                        onFinish={handleAddCategory}
                                    >
                                        <Form.Item
                                            className='mb-3'
                                            name="category"
                                            label='Tên danh mục'
                                            rules={[{ required: true, message: 'Nhập tên danh mục!' }]}
                                        >
                                            <Input placeholder="Nhập tên danh mục" />
                                        </Form.Item>

                                        <Button type='primary' loading={loadingCategory} onClick={() => formAddCategory.submit()} className='flex float-end'>Thêm danh mục</Button>
                                    </Form>
                                </>
                            ,
                        },
                        {
                            label: 'Chỉnh sửa danh mục',
                            key: '2',
                            children:
                                <>
                                    <Table
                                        loading={loadingCategory}
                                        data={dataCategoryCourse}
                                        columns={columnsCategory}
                                        onSave={handlePutCategory}
                                        onDelete={handleDelCategory}
                                        width={'20%'}
                                        scroll={{ x: 500, y: 350 }}
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

export default Courses