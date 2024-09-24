import React, { useEffect, useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Tabs, Modal, Input, Button, Popconfirm, TreeSelect, Card, Dropdown, Skeleton, Form, Typography } from 'antd';
import SortableTree, { changeNodeAtPath, removeNodeAtPath } from '@nosferatu500/react-sortable-tree';

import { isUrl } from '~/utils/format';
import LayoutAdmin from '~/components/layout/Admin/Layout';
import '@nosferatu500/react-sortable-tree/style.css';
import './Menu.css';

import { FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";
import { toastError, toastSuccess } from '~/components/toast';

const WebMenu = ({ data }) => {
    const [treeData, setTreeData] = useState(data);
    const [editingNode, setEditingNode] = useState(null);
    const [modal2Open, setModal2Open] = useState(false);
    const [form] = Form.useForm();

    const getNodeKey = ({ treeIndex }) => treeIndex;

    const handleEditNode = (node, path) => {
        setEditingNode({ node, path });
        form.setFieldsValue({
            title: node.title,
            subtitle: node.subtitle,
            icon: node.icon,
        });
        setModal2Open(true);
    };

    const addNewNode = () => {
        setTreeData([...treeData, { title: 'Chưa đặt tên' }]);
    };

    const addNode = (node, path) => {
        if (path.length >= 3) {
            toastError('', 'Không thể thêm menu con nữa');
            return;
        }

        const newNode = { title: 'Chưa đặt tên' };
        const newTreeData = changeNodeAtPath({
            treeData: treeData,
            path: path,
            getNodeKey: getNodeKey,
            newNode: { ...node, children: (node.children || []).concat(newNode), expanded: true },
        });
        setTreeData(newTreeData);
        toastSuccess('', 'Đã thêm menu');
    };

    const delNode = (path) => {
        const delTreeData = removeNodeAtPath({
            treeData: treeData,
            path: path,
            getNodeKey: getNodeKey,
        });
        setTreeData(delTreeData);
        toastSuccess('', 'Đã xóa menu');
    };

    const updateNode = () => {
        if (editingNode) {
            form
                .validateFields()
                .then(values => {
                    const updatedNode = {
                        ...editingNode.node,
                        title: values.title,
                        subtitle: values.subtitle,
                        icon: values.icon,
                    };

                    const newTreeData = changeNodeAtPath({
                        treeData: treeData,
                        path: editingNode.path,
                        getNodeKey: getNodeKey,
                        newNode: updatedNode,
                    });

                    setTreeData(newTreeData);
                    setEditingNode(null);
                    toastSuccess('Đã cập nhật menu');
                })
                .catch(errorInfo => {
                    console.log('Validate Failed:', errorInfo);
                });

            setModal2Open(false);
        }
    };

    const handlePut = (values) => {
        console.log(values);

        // if (Array.isArray(treeData) && treeData.length === 0) {
        //     toastError('', "Chưa có dữ liệu menu !");
        //     return;
        // }

        // menuApi.updateMenu(treeData)
        //     .then((data) => {
        //         toastSuccess(data.message);
        //     })
        //     .catch((error) => {
        //         toastError('', "Failed to update menu: " + error.message);
        //     });
    };

    return (
        <>
            <Card
                title=
                <div className='flex justify-between'>
                    <Typography>123</Typography>
                    <div className="flex gap-2">
                        <Button onClick={addNewNode}>Thêm menu</Button>
                        {/* <Button type='primary'>Cập nhập</Button> */}
                    </div>
                </div>
                bordered={false}
            >
                <Skeleton loading={treeData.length === 0} active />
                <DndProvider backend={HTML5Backend}>
                    <div className='sortable-height'>
                        <SortableTree
                            treeData={treeData}
                            onChange={setTreeData}
                            maxDepth={3}
                            generateNodeProps={({ node, path }) => ({
                                buttons: [
                                    <Dropdown
                                        key="dropdown"
                                        menu={{
                                            items: [
                                                {
                                                    key: 'edit',
                                                    label: (
                                                        <div className='flex items-center my-1' onClick={() => handleEditNode(node, path)}>
                                                            <FaEdit size={22} />
                                                            <p className='mb-0'> Chỉnh sửa</p>
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    key: 'add',
                                                    label: (
                                                        <div className='flex items-center my-1' onClick={() => addNode(node, path)}>
                                                            <IoAddCircle size={22} />
                                                            <p className='mb-0'> Thêm con</p>
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    key: 'del',
                                                    label: (
                                                        <Popconfirm
                                                            placement="bottom"
                                                            title="Xác Nhận Xóa Menu"
                                                            description="Bạn có muốn xóa menu (bao gồm cả menu con) ?"
                                                            onConfirm={() => delNode(path)}
                                                            okText="Có"
                                                            cancelText="Không"
                                                        >
                                                            <div className='flex items-center my-1'>
                                                                <FaTrash size={22} />
                                                                <p className='mb-0'> Xóa</p>
                                                            </div>
                                                        </Popconfirm>
                                                    ),
                                                },
                                            ],
                                        }}
                                        placement="bottomLeft"
                                    >
                                        <Button type='link' className='button-bar'>
                                            <FaEllipsisV />
                                        </Button>
                                    </Dropdown>
                                ]
                            })}
                        />
                    </div>
                </DndProvider>
            </Card>

            <Modal
                centered
                open={modal2Open}
                onOk={() => form.submit()}
                onCancel={() => setModal2Open(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    onFinish={handlePut}
                >
                    <Form.Item
                        label="Tên menu"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tên menu!' }]}
                    >
                        <Input placeholder="Nhập title..." />
                    </Form.Item>

                    <Form.Item
                        label="Icon"
                        name="icon"
                    >
                        <Input placeholder="Nhập icon..." />
                    </Form.Item>

                    <Form.Item
                        name="subtitle"
                    >
                        <Tabs defaultActiveKey="1" centered>
                            <Tabs.TabPane tab="Trang" key="page">
                                <TreeSelect
                                    style={{ width: '100%' }}
                                    treeLine={true}
                                    value={isUrl(form.getFieldValue('subtitle')) ? form.getFieldValue('subtitle') : undefined}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="Chọn bài viết"
                                    onChange={value => form.setFieldsValue({ subtitle: value })}
                                />
                            </Tabs.TabPane>

                            <Tabs.TabPane tab="Đường dẫn" key="link">
                                <Input
                                    placeholder="Nhập đường dẫn.."
                                    value={isUrl(form.getFieldValue('subtitle')) ? form.getFieldValue('subtitle') : undefined}
                                    onChange={e => form.setFieldsValue({ subtitle: e.target.value })}
                                />
                            </Tabs.TabPane>
                        </Tabs>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default WebMenu;
