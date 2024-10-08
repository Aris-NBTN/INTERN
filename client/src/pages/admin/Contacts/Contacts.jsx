import { Card, Tabs } from 'antd';
import React, { useEffect, useState } from 'react'
import { contactApi } from '~/apis/contact';
import { fileMangerApi } from '~/apis/fileMangerApi';
import LayoutAdmin from '~/components/layout/Admin/Layout'
import Table from '~/components/table/Table';

const Contacts = () => {
    const [fileJson, setFileJson] = useState()
    const [file, setFile] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        fileMangerApi
            .filesInFolder({ folderName: 'uploads/contacts' })
            .then(res => {
                const children = res.newData.children;
                setFileJson(children);
                if (children.length > 0) {
                    const file = children[0].name.split('.')[0];
                    return contactApi.get({ filename: file })
                        .then(fileDetails => {
                            children[0] = { ...children[0], details: fileDetails };
                            setFile(children[0].details.data);
                            const longestObject = children[0].details.data.reduce((a, b) =>
                                Object.keys(a).length > Object.keys(b).length ? a : b
                            );
                            const newData = Object.keys(longestObject).map(key => ({
                                title: key.charAt(0).toUpperCase() + key.slice(1),
                                dataIndex: key,
                                key: key,
                            }));
                            setColumns(newData);
                        });
                }
                return children;
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <LayoutAdmin
            title={'Liên hệ'}
            header={'LIÊN HỆ'}
        >
            <Tabs
                onChange={(key) => {
                    contactApi
                        .get({ filename: key.split('.')[0] })
                        .then(fileDetails => {
                            fileJson.map((data, index) => {
                                if (data.name === key) {
                                    data.details = fileDetails;
                                    setFile(data.details.data);
                                    const longestObject = data.details.data.reduce((a, b) =>
                                        Object.keys(a).length > Object.keys(b).length ? a : b
                                    );
                                    const newData = Object.keys(longestObject).map(key => ({
                                        title: key.charAt(0).toUpperCase() + key.slice(1),
                                        dataIndex: key,
                                        key: key,
                                    }));
                                    setColumns(newData);
                                }
                            });
                        })
                }}
                type='card'
                tabPosition='left'
                items={fileJson?.map((data, index) => {
                    return {
                        label: data.name,
                        key: data.name,
                        children: <>
                            <Table
                                colEdit={false}
                                dragMode={false}
                                data={file}
                                columns={columns}
                            />
                        </>,
                    };
                })}
            />
        </LayoutAdmin>
    )
}

export default Contacts