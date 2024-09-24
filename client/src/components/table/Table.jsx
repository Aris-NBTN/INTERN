import { useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Select, Table, Tooltip, Typography } from 'antd';

import SkeletonTable from '~/components/loading/SkeletonTable';
import { toastError, } from '~/components/toast';

import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const EditableTable = ({
    loading,
    data,
    columns,
    onSave,
    onDelete,
    button,
    colEdit = true,
    isScroll = true,
    scroll,
    width
}) => {

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [countData, setCountData] = useState(data?.length || 0);

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.resetFields();
        form.setFieldsValue(record);
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async () => {
        try {
            const row = await form.validateFields();
            const data = { ...row, id: editingKey };
            onSave(data);
            setEditingKey('');
        } catch (errInfo) {
            toastError('Lưu thay đổi thất bại !', 'Vui lòng kiểm tra lại thông tin !');
        }
    };

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        type,
        required,
        optionSelect,
        children,
        ...restProps
    }) => {
        const inputNode =
            type === 'number' ? <InputNumber
                className='w-full'
                placeholder={`${title}`}
            />
                : type === 'price' ? <InputNumber
                    className='w-full'
                    min={0}
                    step={50000}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                    placeholder={`${title}`}
                />

                    : type === 'percent' ? <InputNumber
                        className='w-full'
                        min={0}
                        max={100}
                        placeholder={`${title}`}
                    />
                        : type === 'select-multi' ? <Select
                            allowClear
                            mode="multiple"
                            placeholder={`${title}`}
                            options={optionSelect}
                        />
                            : type === 'select' ? <Select
                                placeholder={`${title}`}
                                options={optionSelect}
                            />
                                : type === 'tag' ? <Select
                                    mode='tags'
                                    placeholder={`${title}`}
                                />
                                    : <Input
                                        placeholder={`${title}`}
                                    />;
        return (
            <td {...restProps}>

                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                    // rules={[
                    //     {
                    //         required: true,
                    //         message:
                    //             <>
                    //                 <div className="flex justify-center">
                    //                     Bỏ trống !
                    //                 </div>
                    //             </>
                    //     },
                    // ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                type: col.type || 'text',
                optionSelect: (col.type === 'select' || col.type === 'select-multi') ? col.optionSelect : undefined,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                required: col.required || true,
            }),
        };
    });

    return (
        <Form form={form} component={false}>
            {loading ? (
                <SkeletonTable
                    columns={columns}
                    data={data}
                    isLoading={loading}
                />
            ) : (
                <Table
                    scroll={isScroll ? (scroll || { x: 1200, y: 'calc(100vh - 265px)' }) : undefined}
                    components={{ body: { cell: EditableCell } }}
                    bordered
                    onRow={(record) => {
                        return {
                            onDoubleClick: () => {
                                if (colEdit) edit(record);
                            },
                        };
                    }}
                    dataSource={data}
                    onChange={(pagination, filters, sorter, extra) => {
                        setCountData(extra.currentDataSource.length);
                    }}
                    columns={[
                        ...mergedColumns,
                        ...(data?.length >= 1 && colEdit !== false ? [{
                            title: 'Chỉnh sửa',
                            dataIndex: 'operation',
                            width: width || '7%',
                            fixed: 'right',
                            render: (_, record) => {
                                const editable = isEditing(record);
                                return editable ? (
                                    <span className='flex justify-center gap-3' style={{ cursor: 'pointer' }}>
                                        <Typography.Text type="danger" onClick={cancel}>
                                            <FaTimes size={22} />
                                        </Typography.Text>

                                        <Popconfirm
                                            placement="bottomRight"
                                            title="Bạn có chắc muốn lưu thay đổi"
                                            onConfirm={() => save()}
                                        >
                                            <Typography.Text type="success">
                                                <FaSave size={22} />
                                            </Typography.Text>
                                        </Popconfirm>
                                    </span>
                                ) : (
                                    <div className="flex justify-center items-center gap-3" style={{ cursor: 'pointer' }}>
                                        {button && typeof button === 'function' ? button(record) : null}

                                        <Tooltip title='Chỉnh thông tin'>
                                            <Typography.Link
                                                disabled={editingKey !== ''}
                                                onClick={() => {
                                                    edit(record);
                                                }}
                                            >
                                                <FaEdit size={22} />
                                            </Typography.Link>
                                        </Tooltip>

                                        <Popconfirm
                                            disabled={editingKey !== ''}
                                            placement="bottomRight"
                                            title="Bạn có chắc muốn xóa !"
                                            onConfirm={() => {
                                                onDelete(record._id);
                                            }}
                                        >
                                            <Tooltip title='Xóa thông tin'>
                                                <Typography.Text type="danger" disabled={editingKey !== ''}>
                                                    <FaTrash size={22} />
                                                </Typography.Text>
                                            </Tooltip>

                                        </Popconfirm>
                                    </div>
                                );
                            },
                        }] : []),
                    ]}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                        showSizeChanger: true,
                    }}
                    footer={() =>
                        <>
                            <div className="flex justify-end">
                                Tổng cộng: {countData}
                            </div>
                        </>
                    }
                />
            )}

        </Form>
    );
};
export default EditableTable;
