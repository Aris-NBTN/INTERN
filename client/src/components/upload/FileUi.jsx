import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { toastError, toastSuccess } from '../toast';
import { baseURL } from '~/utils';
import { courseApi } from '~/apis/courseApi';

const props = {
    name: 'fileVideo',
    multiple: false,
    action: `${baseURL}/v1/file/video`,
    onChange(info) {
        const { status, response } = info.file;
        if (status === 'done') {
            toastSuccess('Success', 'Tải file thành công!');
            console.log(response);
        } else if (status === 'error') {
            toastError('Error', 'Lỗi khi tải file!', response.message);
            info.fileList = [];
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};
const App = () => (
    <Upload.Dragger
        data={{ folder: '123' }}
        {...props}>
        <p className="ant-upload-drag-icon"> <InboxOutlined /></p>
        <p className="ant-upload-text">Chọn hoặc kéo thả tệp để tải lên</p>
        <p className="ant-upload-hint">Hỗ trợ các file Video</p>
    </Upload.Dragger>
);
export default App;