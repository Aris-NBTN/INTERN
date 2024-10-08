import { Button, Card, Col, Collapse, Empty, Popconfirm, Progress, Row, theme, Typography } from 'antd';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { MdOutlineSlowMotionVideo } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useBeforeUnload, useNavigate, useParams } from 'react-router-dom';
import { courseApi } from '~/apis/courseApi';
import { userApi } from '~/apis/userApi';

import LayoutAdmin from '~/components/layout/Admin/Layout';
import { toastError } from '~/components/toast';
import Video from '~/components/video/Video';
import { baseURL } from '~/utils';

const HomePage = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { token: { colorPrimary } } = theme.useToken();
    const mediaPlayerRef = useRef(null);
    const contentContainerRef = useRef(null);

    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);

    const [course, setCourse] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);

    const refs = {
        videoRef: useRef(null),
        modulesRef: useRef(null),
        contentRef: useRef(null)
    };

    const tourSteps = [
        {
            placement: 'right',
            title: 'Video khóa học!',
            description: 'Xem video để hiểu rõ hơn về khóa học!',
            target: () => refs.videoRef.current,
        },
        {
            placement: 'left',
            title: 'Học phần!',
            description: 'Trong học phần có nhiều bài học, hãy chọn bài học để học!',
            target: () => refs.modulesRef.current,
        },
        {
            placement: 'top',
            title: 'Nội dung và ghi chú bài học!',
            description: 'Hãy đọc kỹ nội dung và ghi chú bài học để hiểu nhiều kiến thức hơn!',
            target: () => refs.contentRef.current,
        },
    ];

    const checkCourseAccess = useCallback((courses, userCourses, targetSlug) => {
        const course = courses?.find(course => course.slug === targetSlug);
        return course?._id || null;
    }, []);

    const getLatestWatchedVideo = useCallback((user, courseModules) => {
        if (!user?.video || !courseModules) return null;

        const watchedVideos = user.video
            .filter(video => video.watched)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        const latestVideo = watchedVideos[0];
        if (!latestVideo) return null;

        for (const module of courseModules) {
            for (const child of module.children) {
                if (child._id === latestVideo.videoId) {
                    return { ...child, watchTime: latestVideo.watchTime };
                }
            }
        }
        return null;
    }, []);

    const addWatchTimeToCourse = useCallback((courseData, userWatchedVideos) => {
        if (!courseData?.module || !userWatchedVideos) return courseData;

        return {
            ...courseData,
            module: courseData.module.map(module => ({
                ...module,
                children: module.children.map(video => {
                    const watchedVideo = userWatchedVideos.find(v => v.videoId === video._id);
                    return {
                        ...video,
                        watchTime: watchedVideo ? watchedVideo.watchTime : undefined,
                        watched: !!watchedVideo
                    };
                })
            }))
        };
    }, []);

    const injectStyles = useCallback(() => {
        if (currentVideo?.content?.css) {
            const styleElement = document.createElement('style');
            styleElement.textContent = currentVideo.content.css;
            document.head.appendChild(styleElement);

            return () => {
                document.head.removeChild(styleElement);
            };
        }
    }, [currentVideo]);

    const injectScripts = useCallback(() => {
        if (currentVideo?.content?.js) {
            const scriptContent = `
                (function() {
                    try {
                        ${currentVideo.content.js}
                    } catch (error) {
                        console.error('Error in lesson script:', error);
                    }
                })();
            `;

            const scriptElement = document.createElement('script');
            scriptElement.type = 'text/javascript';
            scriptElement.textContent = scriptContent;
            contentContainerRef.current?.appendChild(scriptElement);

            return () => {
                if (contentContainerRef.current?.contains(scriptElement)) {
                    contentContainerRef.current.removeChild(scriptElement);
                }
            };
        }
    }, [currentVideo]);

    useEffect(() => {
        const cleanupStyle = injectStyles();
        const cleanupScript = injectScripts();

        return () => {
            if (cleanupStyle) cleanupStyle();
            if (cleanupScript) cleanupScript();
        };
    }, [currentVideo, injectStyles, injectScripts]);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await courseApi.checkCourseUser({ idUser: user._id, slugCourse: slug })
                const processedCourse = addWatchTimeToCourse(response, user.video);
                const latestWatchedVideo = getLatestWatchedVideo(user, processedCourse.module);
                setCourse(processedCourse);
                if (latestWatchedVideo != null) {
                    setCurrentVideo(getLatestWatchedVideo(user, processedCourse.module));
                } else {
                    setCurrentVideo(processedCourse.module[0].children[0]);
                }
                setLoading(false);
            } catch (error) {
                navigate('/user/courses');
                toastError('courses', 'Không thể xem khóa học!', 'Khóa học không tồn tại hoặc bạn chưa mua khóa học này!');
            }
        };

        if (user?._id && slug) {
            fetchCourseData();
        }
    }, [user, navigate, slug, checkCourseAccess, addWatchTimeToCourse, getLatestWatchedVideo]);

    useBeforeUnload(
        useCallback(() => {
            const handleBeforeUnload = () => {
                const currentTime = mediaPlayerRef.current?.currentTime || 0;
                if (user?._id && currentVideo?._id) {
                    userApi.putVideo({
                        id: user._id,
                        videoId: currentVideo._id,
                        watched: true,
                        watchTime: currentTime
                    })
                        .catch(console.error);
                }
            };
            handleBeforeUnload();
        }, [currentVideo, user])
    );

    const courseModules = useMemo(() =>
        course?.module?.map((module) => ({
            key: module._id,
            label: (
                <Typography.Title level={5} strong className='!mb-0'>
                    {module.title}
                </Typography.Title>
            ),
            extra: `${module.children.length} Bài Học`,
            children: module.children.map((video) => (
                <div
                    onClick={() => {
                        setCurrentVideo(video);
                        if (video?.src) {
                            userApi.putVideo({
                                id: user?._id,
                                videoId: video?._id,
                                watched: true,
                            });
                        }
                    }}
                    key={video._id}
                    className='flex justify-between cursor-pointer'
                >
                    <div className='flex items-center gap-1'>
                        {video?.watched ? (
                            <MdOutlineSlowMotionVideo color={colorPrimary} size={20} />
                        ) : (
                            <MdOutlineSlowMotionVideo size={20} />
                        )}
                        <Typography.Title level={5} className='!mb-0 p-2'>
                            {video.title}
                        </Typography.Title>
                    </div>
                    {currentVideo?._id === video._id && (
                        <Typography.Text type='danger' className='!mb-0 p-2'>
                            {video?.src && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 24 24">
                                    <rect width="6" height="14" x="1" y="4" fill="#ff0000">
                                        <animate id="svgSpinnersBarsScaleFade0" fill="freeze" attributeName="y" begin="0;svgSpinnersBarsScaleFade1.end-0.25s" dur="0.75s" values="1;5" />
                                        <animate fill="freeze" attributeName="height" begin="0;svgSpinnersBarsScaleFade1.end-0.25s" dur="0.75s" values="22;14" />
                                        <animate fill="freeze" attributeName="opacity" begin="0;svgSpinnersBarsScaleFade1.end-0.25s" dur="0.75s" values="1;0.2" />
                                    </rect>
                                    <rect width="6" height="14" x="9" y="4" fill="#ff0000" opacity="0.4">
                                        <animate fill="freeze" attributeName="y" begin="svgSpinnersBarsScaleFade0.begin+0.15s" dur="0.75s" values="1;5" />
                                        <animate fill="freeze" attributeName="height" begin="svgSpinnersBarsScaleFade0.begin+0.15s" dur="0.75s" values="22;14" />
                                        <animate fill="freeze" attributeName="opacity" begin="svgSpinnersBarsScaleFade0.begin+0.15s" dur="0.75s" values="1;0.2" />
                                    </rect>
                                    <rect width="6" height="14" x="17" y="4" fill="#ff0000" opacity="0.3">
                                        <animate id="svgSpinnersBarsScaleFade1" fill="freeze" attributeName="y" begin="svgSpinnersBarsScaleFade0.begin+0.3s" dur="0.75s" values="1;5" />
                                        <animate fill="freeze" attributeName="height" begin="svgSpinnersBarsScaleFade0.begin+0.3s" dur="0.75s" values="22;14" />
                                        <animate fill="freeze" attributeName="opacity" begin="svgSpinnersBarsScaleFade0.begin+0.3s" dur="0.75s" values="1;0.2" />
                                    </rect>
                                </svg>
                            )}
                        </Typography.Text>
                    )}
                </div>
            )),
        })),
        [course, colorPrimary, currentVideo, user]
    );

    return (
        <LayoutAdmin
            title={course?.name || 'Khóa học của tôi'}
            tours={tourSteps}
            header={'KHÓA HỌC CỦA TÔI'}
            button={<>
                <Popconfirm
                    placement="left"
                    title={'Xác nhận học lại khóa học?'}
                    description={'Bạn có chắc chắn muốn học lại khóa học này không?'}
                    onConfirm={() => {
                        userApi.putUser({ id: user?._id, video: [] })
                    }}
                >
                    <Button>Học Lại Khóa Học</Button>
                </Popconfirm>
            </>}
        >
            <Row gutter={[24, 24]}>
                <Col xxl={16} xl={15} lg={14} md={24} span={24}>
                    <Card loading={loading} title=<Typography.Title level={3} className='!mb-0'>{course?.name || "Khóa học của tôi"}</Typography.Title> ref={refs.videoRef} className='sticky' style={{ top: '5rem' }}>
                        {currentVideo?.src ? (
                            <Video
                                mediaPlayerRef={mediaPlayerRef}
                                iduser={user?._id}
                                videoId={currentVideo._id}
                                autoPlay={true}
                                time={currentVideo.watchTime}
                                src={`${baseURL}/uploads/${currentVideo.src}`}
                            />
                        ) : (
                            <Empty description='Chưa có video được tải lên!' />
                        )}
                    </Card>
                </Col>

                <Col xxl={8} xl={9} lg={10} md={24} span={24}>
                    <Card loading={loading} title=<Typography.Title level={3} className='!mb-0'>Nội Dung Khóa Học</Typography.Title> ref={refs.modulesRef}>
                        <Collapse
                            expandIconPosition='start'
                            items={courseModules}
                            defaultActiveKey={courseModules?.map(module => module.key)}
                        />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card
                        loading={loading}
                        ref={refs.contentRef}
                        className='mb-6'
                        title={
                            <Typography.Title className='!mb-0' level={3}>
                                Bài Học {currentVideo?.title}
                            </Typography.Title>
                        }
                    >
                        {currentVideo?.content ? (
                            <>
                                <div dangerouslySetInnerHTML={{ __html: currentVideo.content.html }} />
                            </>
                        ) : (
                            <Empty description='Chưa có nội dung được tải lên!' />
                        )}
                    </Card>
                </Col>
            </Row>
        </LayoutAdmin>
    );
};

export default HomePage;