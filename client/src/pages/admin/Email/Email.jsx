import { useRef, useState } from 'react'
import LayoutAdmin from '~/components/layout/Admin/Layout'
import GrapeJs from '~/components/grapeJs/GrapeJs'
import pluginWebpage from 'grapesjs-preset-webpage';
import blockBasic from 'grapesjs-blocks-basic';
import pluginStyleBg from 'grapesjs-style-bg';

import pluginFlexbox from '~/components/grapeJs/Custom/Block/FlexBox/';
import pluginFlexrow from '~/components/grapeJs/Custom/Block/FlexRow';

import { Block } from '~/components/grapeJs/Block/index';
import { Button } from 'antd';
import { toastError, toastSuccess } from '~/components/toast';

import tour2 from '~/assets/tours/email/2.png';

const EmailPage = () => {
    const [email, setEmail] = useState();

    const configGrapeJs = (editor) => {
        const blocksToRemove = [
            'video',
            'map',
            'video',
            'bootstrapIcon',
            'map',
            'model-3D',
            'Masonry',
            'quote',
            "link-block",
            'text-basic',
            'text-section',
            'column1',
            'column2',
            'column3',
            'column3-7',
        ];

        const buttonsToRemove = [
            'gjs-open-import-webpage',
            'open-templates',
            'link-page',
            'export-template'
        ];


        const categoriesToClose = [
            "Extra",
            "Blog",
            "Layout",
            "Short Codes"
        ];

        const { models: categories } = editor.BlockManager.getCategories();

        blocksToRemove.forEach(block => editor.BlockManager.remove(block));
        buttonsToRemove.forEach(buttonId => { editor.Panels.removeButton('options', buttonId) });
        categories.forEach(category => categoriesToClose.includes(category.get?.('id')) && category.set('open', false));
    }

    const putPages = (pageEdit, page) => {
        setEmail(page)
        toastSuccess('', 'Đã cập nhập nội dung Email!', 'Hãy chọn người nhận và gửi email!');
    }

    const sendEmail = () => {
        if (email) {
            toastSuccess('', 'Gửi email thành công');
        } else {
            toastError('', 'Vui lòng nhập email', 'Chưa có nội dung email!');
        }
    }

    const refs = [useRef(null), useRef(null)];
    const steps = [
        {
            title: 'Thiết kế Email!',
            description: 'Thiết kế email của bạn thông qua WebBuilder-Aris',
            target: () => refs[0].current,
        },
        {
            title: 'Ấn nút lưu!',
            description: 'Ấn nút lưu để lưu lại nội dung email của bạn.',
            cover: <img alt="tour.png" src={tour2} />,
        },
        {
            title: 'Gửi Email!',
            description: 'Ấn và chọn người nhận để gửi email!',
            target: () => refs[1].current,
        },
    ];

    return (
        <LayoutAdmin
            margin={0}
            header={'Email'}
            tours={steps}
            button={
                <Button ref={refs[1]} onClick={sendEmail} type='primary'>Gửi email</Button>
            }
        >
            <div ref={refs[0]}>
                <GrapeJs
                    configGrapeJs={configGrapeJs}
                    height='calc(100vh - 56px)'
                    plugins={[
                        pluginWebpage,
                        blockBasic,
                        pluginStyleBg,
                        Block.imageLink,
                        pluginFlexbox,
                        pluginFlexrow,
                    ]}
                    savePage={putPages}
                />
            </div>
        </LayoutAdmin>
    )
}

export default EmailPage