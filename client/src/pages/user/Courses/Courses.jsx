import { Button, Card, Col, Empty, Row, Typography } from 'antd'
import React, { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LayoutAdmin from '~/components/layout/Admin/Layout'
import SkeletonCourse from '~/components/loading/SkeletonCourse';
import { getCourseUserApi } from '~/redux/slices/User/courseSlice';

const CardCourse = lazy(() => import('~/components/course/CardCourse'));

const HomePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { courseUser, loading } = useSelector(state => state.courseUser)

    useEffect(() => {
        if (loading && user?.courses) {
            dispatch(getCourseUserApi({ ids: user.courses }))
        }
    }, [user])

    return (
        <LayoutAdmin
            title='Khóa học của tôi'
            header={'KHÓA HỌC CỦA TÔI'}
        >
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card className='ant-card-box'>
                        <Typography.Title level={3}>Khóa học của tôi</Typography.Title>
                        <Row gutter={[20, 20]}>
                            {loading ? (
                                <Col span={24}><SkeletonCourse loading={loading} quantity={4} /></Col>
                            ) : (
                                courseUser.length === 0 ? (
                                    <Col span={24}>
                                        <div className="flex justify-center">
                                            <Empty
                                                imageStyle={{
                                                    height: 150,
                                                }}
                                                description={
                                                    <Typography.Text>
                                                        Chưa có khóa học <Typography.Link href='/cart'>được mua</Typography.Link>
                                                    </Typography.Text>
                                                }
                                            >
                                                <Button type="primary">Thêm khóa học ngay</Button>
                                            </Empty>
                                        </div>
                                    </Col>
                                ) : (
                                    courseUser.map((course, index) => (
                                        <Col key={index} xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} span={24}>
                                            <CardCourse
                                                openList={false}
                                                ellipsisRow={1}
                                                loading={loading}
                                                info={course}
                                            />
                                        </Col>
                                    ))
                                )
                            )}
                        </Row>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card>
                        <div className="flex justify-between align-center">
                            <Typography.Title level={3}>Khóa học miễn phí</Typography.Title>
                        </div>
                        <Row gutter={[20, 20]}>
                            <Col md={{ span: 6 }} span={24}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <CardCourse
                                        link='/user/course/sd'
                                        ellipsisRow={1}
                                        loading={false}
                                        image='https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                        alt='Ảnh khóa học Chicken War Studio'
                                        name='Chicken War Studio'
                                        title='Học thiết kế 3D với Blender Học thiết kế 3D với BlenderHọc thiết kế 3D với BlenderHọc thiết kế 3D với BlenderHọc thiết kế 3D với BlenderHọc thiết kế 3D với Blender'
                                        price='500.000đ'
                                        height='14rem'
                                    />
                                </Suspense>

                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card className='mb-6'>
                        <div className="flex justify-between align-center">
                            <Typography.Title level={3}>Có thể bạn sẽ thích</Typography.Title>
                            <Typography.Link>Xem thêm</Typography.Link>
                        </div>
                        <Row gutter={[20, 20]}>
                            <Col md={{ span: 6 }} span={24}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <CardCourse
                                        link='/user/course/sd'
                                        ellipsisRow={1}
                                        loading={false}
                                        image='https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                        alt='Ảnh khóa học Chicken War Studio'
                                        name='Chicken War Studio'
                                        title='Học thiết kế 3D với Blender Học thiết kế 3D với BlenderHọc thiết kế 3D với BlenderHọc thiết kế 3D với BlenderHọc thiết kế 3D với BlenderHọc thiết kế 3D với Blender'
                                        price='500.000đ'
                                        height='14rem'
                                    />
                                </Suspense>

                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </LayoutAdmin>
    )
}

export default HomePage