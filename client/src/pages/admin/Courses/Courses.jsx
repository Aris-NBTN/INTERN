import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Tabs, theme, Tooltip, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import LayoutAdmin from '~/components/layout/Admin/Layout'
import Table from '~/components/table/Table';

import { FilterText, FilterDate, FilterSorter, FilterSelect } from '~/components/table/Filter';
import { FindNameById, FormatDay, FormatDayTime, FormatPerCennt, FormatPrice } from '~/components/table/Format';

import { genericDispatch } from '~/redux/utils';
import { useDispatch, useSelector } from 'react-redux';
import { addCourseApi, getCourseApi, delCourseApi, putCourseApi } from '~/redux/slices/Data/coursesSlice';
import { addCategoryCouresApi, getCategoryCouresApi, delCategoryCouresApi, putCategoryCouresApi } from '~/redux/slices/Data/categoryCourseSlice';

import { exportDataExcel } from '~/utils/export';
import { MdAddCircle, MdSlowMotionVideo } from "react-icons/md";
import FileAntd from '~/components/upload/FileAntd';
import { baseURL, baseClient } from '~/utils/index'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';
import { toastSuccess } from '~/components/toast';


const Courses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formAddCourse] = Form.useForm();
    const [formAddCategory] = Form.useForm();
    const [formInfo] = Form.useForm();

    const { token: { colorPrimary } } = theme.useToken();

    const price = Form.useWatch('price', formAddCourse);
    const sale = Form.useWatch('sale', formAddCourse);

    // Modal
    const [openInFor, setOpenInFor] = useState(false);
    const [openCourse, setOpenCourse] = useState(false);
    const [openCategory, setOpenCategory] = useState(false);

    const [info, setInfo] = useState('');

    // Data
    const { courses, loading: loadingCourses } = useSelector((state) => state.courses);
    const { categoryCourses: categories, loading: loadingCategory } = useSelector((state) => state.categoryCourses);

    const dataCourses = useMemo(() =>
        courses.map((course) => ({
            ...course,
            key: course._id,
        })),
        [courses]
    );

    const dataCategoryCourse = useMemo(() =>
        categories.map((category) => ({
            ...category,
            key: category._id,
        })),
        [categories]
    );

    // Column
    const columnsCourse = [
        {
            title: 'Tên khóa học',
            dataIndex: 'name',
            width: '10%',
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
            width: '10%',
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
            optionSelect: Array.isArray(categories) && categories.length > 0 ? categories?.map(item => ({ label: item.category, value: item._id })) : [],
            ...(Array.isArray(categories) && categories.length > 0 ? FilterSelect('category', categories.map(item => ({ text: item.category, value: item._id }))) : {}),
            render: (category) => (category && categories && Array.isArray(categories) && categories.length > 0) ? FindNameById(category, categories, 'category') : null,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            width: '7%',
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
                        setInfo(record);
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
        if (loadingCourses === true) {
            dispatch(getCourseApi());
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
            header={
                <>
                    <div className='flex items-center'>
                        <h6 className='mb-0'>KHÓA HỌC</h6>
                    </div>
                </>
            }
            button={
                <>
                    <Button type='primary' onClick={() => { setOpenCategory(true) }}> Thêm danh mục</Button>
                    <Button type='primary' onClick={() => setOpenCourse(true)}>Thêm khóa học</Button>
                    {/* <Button onClick={() => exportDataExcel(data, 'Course.xlsx')} type='primary'>Xuất file Excel</Button> */}
                </>
            }
        >
            <Table
                loading={loadingCourses}
                data={dataCourses}
                columns={columnsCourse}
                onSave={handlePutCourse}
                onDelete={handleDelCourse}
                button={(record) => (
                    <div className='flex gap-3'>
                        <MdSlowMotionVideo onClick={() => navigate(`/admin/course/${record.slug}`)} size={20} color='red' />
                    </div>
                )}
            />

            {/* Infor */}
            <Modal
                title=<>
                    <div className="flex items-center justify-between">
                        <div> Thông tin khóa học: <Typography.Text type='danger'>{formInfo.getFieldValue('name')}</Typography.Text></div>
                        <Button
                            className='me-4'
                            // type='primary'
                            icon={info?.seo ? <FaCircleCheck size={20} color={colorPrimary} /> : <MdAddCircle size={20} color='red' />}
                            onClick={() => {
                                const ldJs = {
                                    "@context": "https://schema.org/",
                                    "@id": info?.slug,
                                    "@type": "Course",
                                    "name": info?.name,
                                    "description": info?.description,
                                    "publisher": {
                                        "@type": "Organization",
                                        "name": "Chicken War Studio",
                                        "url": `${baseClient}`
                                    },
                                    "provider": {
                                        "@type": "Organization",
                                        "name": "Chicken War Studio",
                                        "url": `${baseClient}`
                                    },
                                    "image": [
                                        `${baseURL}/upload/course/123/${info?.imgDetail}`,
                                        `${baseURL}/upload/course/123/${info?.img}`
                                    ],
                                    "aggregateRating": {
                                        "@type": "AggregateRating",
                                        "ratingValue": info?.star,
                                        "ratingCount": 2000,
                                        "reviewCount": 1200
                                    },
                                    "offers": [
                                        {
                                            "@type": "Offer",
                                            "category": info?.category,
                                            "priceCurrency": "VND",
                                            "price": info?.price
                                        }
                                    ],
                                    "hasCourseInstance": [
                                        {
                                            "@type": "CourseInstance",
                                            "courseMode": "Blended",
                                            "location": "HoChiMinh University",
                                            "courseSchedule": {
                                                "@type": "Schedule",
                                                "duration": "PT3H",
                                                "repeatFrequency": "Daily",
                                                "repeatCount": 31
                                            },
                                            "instructor": [
                                                {
                                                    "@type": "Person",
                                                    "name": "Nguyen Bac Trung Nam",
                                                    "description": "3D Artist",
                                                    "image": `${baseClient}`
                                                }
                                            ]
                                        },
                                        {
                                            "@type": "CourseInstance",
                                            "courseMode": "Online",
                                            "courseWorkload": "PT22H"
                                        }
                                    ],
                                    "totalHistoricalEnrollment": 400,
                                    "datePublished": FormatDay(info?.createdAt),
                                    "educationalLevel": "Advanced",
                                    "about": [
                                        "3D Modeling",
                                        "3D environment",
                                        "3D artist"
                                    ],
                                    "teaches": [
                                        "Practice and apply systems thinking to plan for change",
                                        "Understand how memory allocation works."
                                    ],
                                    "financialAidEligible": "Scholarship Available",
                                    "inLanguage": "vn",
                                    "availableLanguage": [
                                        "vn",
                                        "es"
                                    ],
                                    "coursePrerequisites": [
                                        "Basic understanding of C++ up to arrays and functions.",
                                        `${baseClient}`
                                    ],
                                    "educationalCredentialAwarded": [
                                        {
                                            "@type": "EducationalOccupationalCredential",
                                            "name": "3D Modeling Certificate",
                                            "url": `${baseClient}`,
                                            "credentialCategory": "Certificate"
                                        }
                                    ]
                                }
                                toastSuccess('ldjs', 'Tạo file thành công', 'Đã tạo file LD+JS, vui lòng cập nhập!');
                                formInfo.setFieldValue('seo', ldJs);
                            }}
                        >
                            {info?.seo ? 'Đã tạo file LD+JS' : 'Tạo file LD+JS'}
                        </Button>
                    </div>
                </>
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

                            tokenSeparators={[',']}
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
                            tokenSeparators={[',']}
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

                            tokenSeparators={[',']}
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

                            tokenSeparators={[',']}
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
                                        categories.map(item => ({
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