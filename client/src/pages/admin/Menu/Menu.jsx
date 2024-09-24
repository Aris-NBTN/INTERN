import React, { useEffect, useState } from 'react'
import LayoutAdmin from '~/components/layout/Admin/Layout'
import SortableTree from '~/components/tree/SortableTree'

import { menuApi } from '~/apis/menuApi';
import { Col, Row } from 'antd';

const Menu = () => {
    const [treeData, setTreeData] = useState([]);
    useEffect(() => {
        menuApi.allMenu()
            .then(menu => {
                setTreeData(menu);
            });
    }, []);

    return (
        <LayoutAdmin
            header={'Menu'}
        >
            <Row gutter={[18, 18]}>
                <Col lg={{ span: 12 }} span={24}>
                    {treeData?.header ? (
                        <SortableTree
                            data={treeData.header}
                        />
                    ) : (
                        <p>Loading...</p>
                    )}

                </Col>
                <Col lg={{ span: 12 }} span={24}>
                    {treeData?.footer ? (
                        <SortableTree
                            data={treeData.footer}
                        />
                    ) : (
                        <p>Loading...</p>
                    )}
                </Col>
            </Row>
        </LayoutAdmin>
    )
}

export default Menu