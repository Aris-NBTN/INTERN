import { Skeleton, theme } from 'antd'
import React from 'react'

const SkeletonSuspense = () => {
    const { token: { colorBgContainer } } = theme.useToken();
    return (
        <div className='overflow-hidden'>
            <div className="flex justify-around items-center h-full p-2 gap-2">
                <Skeleton.Image active style={{ height: '70px', width: '300px' }} />
                <Skeleton.Button className="hidden-mobile" active size='large' style={{ width: '300px' }} />
                <Skeleton.Button className="hidden-mobile" active size='large' style={{ width: '300px' }} />
            </div>

            <div className='w-full p-4' style={{ height: 'calc(100vh - 4rem)', backgroundColor: colorBgContainer }}>
                <Skeleton
                    title={false}
                    paragraph={{ rows: 30, width: '100%' }}
                    active
                />
            </div>
        </div>
    )
}

export default SkeletonSuspense