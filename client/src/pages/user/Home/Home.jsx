import { Card, Col, Progress, Row, Typography } from 'antd'
import LayoutAdmin from '~/components/layout/Admin/Layout'
import EChartsLineChart from '~/components/charts/Line'
import { useSelector } from 'react-redux';

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    console.log(user);

    return (
        <LayoutAdmin
            title='Trang chủ'
            header={'TRANG CHỦ'}
        >
            <Row gutter={[18, 18]}>
                <Col md={{ span: 8 }} span={24}>
                    <Card className='ant-card-pro' title='Khóa học đang học'>
                        <Typography.Title level={2} className='text-center'>50%</Typography.Title>
                        <Progress
                            size={['100%', 18]}
                            percent={50}
                            status="active"
                            percentPosition={{
                                align: 'center',
                                type: '',
                            }}
                            strokeColor={{
                                from: '#108ee9',
                                to: '#87d068',
                            }}
                        />
                    </Card>
                </Col>
                <Col md={{ span: 8 }} span={24}>
                    <Card className='ant-card-pro' title='Tiến trình học tập' styles={{ body: { padding: 22 } }}>
                        <EChartsLineChart />
                    </Card>
                </Col>
                <Col md={{ span: 8 }} span={24}>
                    <Card className='ant-card-pro' title='Khóa học đã hoàn thành'>
                        <Typography.Title level={2} className='text-center'>0%</Typography.Title>
                        <Progress
                            size={['100%', 18]}
                            percent={50}
                            status="active"
                            percentPosition={{
                                align: 'center',
                                type: '',
                            }}
                            strokeColor={{
                                from: '#108ee9',
                                to: '#87d068',
                            }}
                        />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title='Video khóa học gần đây'>
                        <Row>
                            <Col span={18}>
                                {/* <Video
                                    mediaPlayerRef={mediaPlayerRef}
                                    iduser={user?._id}
                                    videoId={currentVideo._id}
                                    autoPlay={true}
                                    time={currentVideo.watchTime}
                                    src={`${baseURL}/uploads/${currentVideo.src}`}
                                /> */}
                            </Col>
                            <Col span={6}></Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </LayoutAdmin>
    )
}

export default Home