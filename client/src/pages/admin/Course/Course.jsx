import { useState } from 'react'
import { Button, Card, Col, Input, Row, Tree, Empty, message, Modal, Form, Tooltip, Typography } from 'antd'

import LayoutAdmin from '~/components/layout/Admin/Layout'
import FileUi from '~/components/upload/FileUi';
import Video from '~/components/video/Video';

import { DownOutlined } from '@ant-design/icons';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import GrapeJs from '~/components/grapeJs/GrapeJs'

import { courseApi } from '~/apis/courseApi';

import './Course.css'

const Course = () => {
    const generateData = (numParents, numChildren) => {
        const textTracks = [
            {
                src: 'https://files.vidstack.io/sprite-fight/subs/english.vtt',
                label: 'English',
                language: 'en-US',
                kind: 'subtitles',
                default: true,
            },
            {
                src: 'https://files.vidstack.io/sprite-fight/subs/spanish.vtt',
                label: 'Spanish',
                language: 'es-ES',
                kind: 'subtitles',
            },
            {
                src: 'https://files.vidstack.io/sprite-fight/chapters.vtt',
                kind: 'chapters',
                language: 'en-US',
                default: true,
            },
        ];

        const baseSrc = ''; //https://files.vidstack.io/sprite-fight/720p.mp4
        const basePoster = 'https://files.vidstack.io/sprite-fight/poster.webp';
        const baseThumbnailTracks = 'https://files.vidstack.io/sprite-fight/thumbnails.vtt';

        return Array.from({ length: numParents }, (_, parentIndex) => ({
            title: `aaa_${parentIndex}`,
            key: `aaa_${parentIndex}`,
            children: Array.from({ length: numChildren }, (_, childIndex) => ({
                key: `bbb_${parentIndex}-${childIndex}`,
                title: `aaa_Tên  ${parentIndex}-${childIndex}`,
                src: baseSrc,
                poster: basePoster,
                textTracks: textTracks,
                thumbnailTracks: baseThumbnailTracks
            }))
        }));
    };

    const [data, setData] = useState(generateData(2, 4));
    const [title, setTitle] = useState();
    const [course, setCourse] = useState();

    const [formAddCourseModule] = Form.useForm();

    // Modal
    const [openAddCourseModule, setOpenAddCourseModule] = useState(false);

    const loop = (data, key, callback) => {
        data.some((item, index, arr) => {
            if (item.key === key) return callback(item, index, arr);
            if (item.children) return loop(item.children, key, callback);
        });
    };

    const onDrop = (info) => {
        const { dragNode, node, dropPosition: dropPos, dropToGap } = info;
        const dropKey = node.key;
        const dragKey = dragNode.key;
        const dataG = [...data];

        const findParent = (data, key) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].children) {
                    const index = data[i].children.findIndex(child => child.key === key);
                    if (index > -1) {
                        return data[i];
                    }
                }
            }
            return null;
        };

        const dragParent = findParent(dataG, dragKey);
        const dropParent = findParent(dataG, dropKey);

        if (dragParent) {
            if (!dropToGap && node.children) {
                let dragObj;
                loop(dataG, dragKey, (item, index, arr) => {
                    arr.splice(index, 1);
                    dragObj = item;
                });
                loop(dataG, dropKey, item => {
                    item.children = item.children || [];
                    item.children.unshift(dragObj);
                });
                message.success('Đã di chuyển bài học sang học phần mới');
            } else if (dropParent && dropParent.key === dragParent.key) {
                let dragObj;
                loop(dataG, dragKey, (item, index, arr) => {
                    arr.splice(index, 1);
                    dragObj = item;
                });
                loop(dataG, dropKey, (item, index, arr) => {
                    arr.splice(dropPos < 0 ? index : index + 1, 0, dragObj);
                });
                message.success('Đã thay đổi thứ tự bài học trong học phần');
            } else {
                message.error('Không thể di chuyển bài học ra ngoài học phần');
                return;
            }
        } else {
            if (!dropToGap && node.children) {
                message.error('Không thể di chuyển học phần vào bên trong học phần khác');
                return;
            }

            let dragObj;
            loop(dataG, dragKey, (item, index, arr) => {
                arr.splice(index, 1);
                dragObj = item;
            });

            loop(dataG, dropKey, (item, index, arr) => {
                arr.splice(dropPos < 0 ? index : index + 1, 0, dragObj);
            });
            message.success('Đã thay đổi thứ tự học phần');
        }

        setData(dataG);
    };

    const handleAddCourseModule = (data) => {
    }

    return (
        <LayoutAdmin
            header={
                <>
                    <div className='flex items-center'>
                        <h6 className='mb-0'>Khóa học</h6>
                    </div>
                </>
            }
            button={
                <>
                    <Button type='primary' onClick={() => setOpenAddCourseModule(true)}>Thêm học phần</Button>
                    <Button type='primary' onClick={() => console.log(course)}>Lưu thông tin</Button>
                </>
            }
        >
            <Row>
                <Col span={24}>
                    <Card
                        title=
                        <>
                            <div className='flex justify-between items-center flex-wrap gap-2'>
                                <h4 className='mb-0'>Học phần</h4>
                                <div className='flex flex-wrap justify-center items-center gap-2'>
                                    {title != undefined && (
                                        <>
                                            <Input
                                                addonBefore={`Tên ${title.type === 'children' ? 'Bài học' : 'Học phần'}`}
                                                style={{ width: 350 }}
                                                value={title.title}
                                                onChange={(e) => setTitle({ ...title, title: e.target.value })}
                                                placeholder={`Nhập tên ${title.type === 'children' ? 'bài học' : 'học phần'}`}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                        className='mb-6'
                    >

                        <Row gutter={[20, 20]}>
                            <Col
                                md={{ span: 6 }}
                                span={24}
                            >
                                <Tree
                                    className="draggable-tree"
                                    style={{ overflow: 'auto', height: 450 }}
                                    draggable
                                    blockNode
                                    showLine
                                    // switcherIcon={ }
                                    onDrop={onDrop}
                                    titleRender={(nodeData) => {
                                        return (
                                            <div className='flex justify-between items-center gap-2'>
                                                <Typography.Paragraph
                                                    className='!m-0'
                                                    ellipsis={{ suffix: '' }}
                                                >
                                                    {nodeData.title}
                                                </Typography.Paragraph>

                                                <div className='flex gap-1'>
                                                    {nodeData.children && (
                                                        <Tooltip placement="right" title={`Thêm bài học - học phần`}>
                                                            <Button className='p-0' type='primary' ghost icon={<FaPlusCircle />} size='small'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    console.log(nodeData);
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    )}

                                                    <Tooltip placement="right" title={`Xóa`}>
                                                        <Button className='p-0' danger icon={<FaMinusCircle />} size='small'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                console.log(nodeData);
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        )
                                    }}

                                    onSelect={(selectedKeys, info) => {
                                        const { key, title, src, poster, textTracks, thumbnailTracks } = info.node;

                                        if (selectedKeys.length === 0) {
                                            setTitle(undefined);
                                            return;
                                        }

                                        if (info.selectedNodes && info.selectedNodes.length > 0 && info.selectedNodes[0].children) {
                                            setTitle({ title: info.node.title, type: 'parent' });
                                        } else {
                                            setTitle({ title: info.node.title, type: 'children' });
                                            setCourse({ key, title, src, poster, textTracks, thumbnailTracks });
                                        }
                                    }}
                                    treeData={data}
                                />
                            </Col>

                            <Col
                                md={{ span: title?.type === 'children' ? 15 : 18 }}
                                span={24}
                            >
                                {title?.type === 'children' && (
                                    course?.src ? (
                                        <Video
                                            height='450px'
                                            src={course?.src || undefined}
                                            poster={course?.poster || undefined}
                                            textTracks={course?.textTracks || []}
                                            thumbnailTracks={course?.thumbnailTracks || undefined}
                                        />
                                    ) : (
                                        <FileUi
                                            header={
                                                <>
                                                    <div className="flex justify-end me-2">
                                                        <div style={{ fontSize: 16 }}>Designed by Aris</div>
                                                    </div>
                                                </>
                                            }
                                            footer={'Cho phép tải lên các loại về file video !'}
                                            title={<>Tải lên video cho bài học: <Typography.Text type='danger'>{title?.title}</Typography.Text></>}
                                            api={'http://localhost:8082/v1/file/video'}
                                        />
                                    )
                                ) || (
                                        <Card>
                                            <Empty />
                                        </Card>
                                    )}
                            </Col>

                            {title?.type === 'children' && course?.src ? (
                                <Col className='flex flex-col gap-4' md={{ span: 3 }} span={24}>
                                    <Button disabled type='primary' ghost>Thêm phụ đề</Button>
                                    <Button disabled type='primary' ghost>Thêm chia đoạn</Button>
                                    <Button disabled type='primary' ghost>Tạo ảnh Thumbnails</Button>
                                    <Button type='primary' ghost>Tạo ảnh Poster</Button>
                                    <Button type='primary' ghost danger>Xóa Video</Button>
                                </Col>
                            ) : null}
                        </Row>
                    </Card>
                </Col>

                <Col className=' mb-6' span={24}>
                    {title?.type === 'children' && (
                        <Card
                            title=<>
                                <h4 className='mb-0'>Nội dung bài học: <span className='text-danger'>{title?.title}</span></h4>
                            </>
                            className='editor-grapejs'
                        >
                            {/* <GrapeJs
                                data={course}
                            /> */}
                        </Card>
                    )}
                </Col>

                <Col className='mb-6' span={24}>
                    <Card title='Thông báo'>
                        Chưa có thông báo
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Thêm học phần"
                centered
                open={openAddCourseModule}
                onOk={() => formAddCourseModule.submit()}
                onCancel={() => setOpenAddCourseModule(false)}
                width={600}
            >
                <Form
                    form={formAddCourseModule}
                    name="customForm"
                    layout="vertical"
                    onFinish={handleAddCourseModule}
                >
                    <Form.Item
                        className='mb-2'
                        name="name"
                        label="Tên học phần"
                        rules={[{ required: true, message: 'Nhập tên học phần!' }]}
                    >
                        <Input placeholder="Nhập tên học phần" />
                    </Form.Item>
                </Form>
            </Modal>
        </LayoutAdmin>
    )
}

export default Course