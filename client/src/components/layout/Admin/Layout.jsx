import { useMemo, useRef, useState } from 'react';
import { Avatar, Button, Drawer, Dropdown, Layout, Menu, Popover, Select, Tooltip, Tour, Typography, theme } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '~/redux/slices/languageSlice';
import { useMediaQuery } from 'react-responsive';
import { toastError, toastSuccess } from '~/components/toast';
import StrokeLogo from '~/components/animation/StrokeLogo'
import { toggleCompact } from '~/redux/slices/collapsedSlice'

import { FaSignOutAlt, FaTachometerAlt, FaUser, FaLanguage, FaShoppingCart, FaInfoCircle, FaKey, FaDatabase, FaChartPie, FaHome } from "react-icons/fa";
import { FaYoutube, FaFolderOpen, FaEarthAmericas, FaFileCirclePlus, FaGear, FaBars, FaCircleQuestion } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import { AiFillLayout } from "react-icons/ai";
import { PiIdentificationCardFill } from "react-icons/pi";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "react-icons/tb";
import { IoMdMail } from "react-icons/io";
import { BsPlugin } from "react-icons/bs";

import { TYPE_EMPLOYEE } from "~/utils";

import './Layout.css';
import 'animate.css';

const { Header, Sider, Content } = Layout;

const LayoutAdmin = ({
    title = "Chicken War Studio",
    description = "Chicken War Studio",
    keywords = "Chicken War Studio",
    author = "Chicken War Studio",
    children,
    header,
    button,
    margin = 24,
    tours,
}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isMobile = useMediaQuery({ query: '(max-width: 576px)' });
    const { token: { colorBgContainer, colorPrimary } } = theme.useToken();
    const { user: { userType } } = useSelector((state) => state.auth);
    const currentLanguage = useSelector((state) => state.language.currentLanguage);
    const collapsed = useSelector((state) => state.collapsed.collapsedMode);
    const darkMode = useSelector((state) => state.theme.darkMode);

    const [open, setOpen] = useState(false);
    const [openTour, setOpenTour] = useState(false);
    const popRef = useRef(null);

    const languages = [
        {
            value: 'vi_VN',
            label: 'Việt Nam',
            desc: 'Việt Nam',
        },
    ];

    const menuSidebars = useMemo(() => {
        const menuItems = [];
        switch (userType) {
            case TYPE_EMPLOYEE.admin: {
                menuItems.push({
                    key: "dashboard",
                    icon: <FaTachometerAlt size={18} />,
                    label: "Bảng Điều Khiển",
                    link: "/admin",
                });
                menuItems.push({
                    key: "pages",
                    icon: <FaEarthAmericas size={18} />,
                    label: "Website",
                    children: [
                        {
                            key: "website",
                            icon: <FaInfoCircle size={18} />,
                            label: "Thông tin",
                            link: "/admin/info",
                        },
                        {
                            key: "menu",
                            icon: <FaBars size={18} />,
                            label: "Menu",
                            link: "/admin/menu",
                        },
                        {
                            key: "layout",
                            icon: <AiFillLayout size={18} />,
                            label: "Bố cục",
                            link: "/admin/layout",
                        },
                        {
                            key: "page",
                            icon: <FaFileCirclePlus size={18} />,
                            label: "Bài viết",
                            link: "/admin/pages",
                        }
                    ]
                });
                menuItems.push({
                    key: "plugins",
                    icon: <BsPlugin size={18} />,
                    label: "Plugins",
                    link: "/admin/plugins",
                });
                menuItems.push({
                    key: "user",
                    icon: <FaUser size={18} />,
                    label: "Người dùng",
                    link: "/admin/users",
                });
                menuItems.push({
                    key: "courses",
                    icon: <FaChartPie size={18} />,
                    label: "Khóa học",
                    link: "/admin/courses",
                });
                menuItems.push({
                    key: "orders",
                    icon: <FaShoppingCart size={18} />,
                    label: "Đơn hàng",
                    link: "/admin/orders",
                });
                menuItems.push({
                    key: "email",
                    icon: <IoMdMail size={18} />,
                    label: "Email",
                    link: "/admin/email",
                });
                menuItems.push({
                    key: "fileManager",
                    icon: <FaFolderOpen size={18} />,
                    label: "Quản lý file",
                    link: "/admin/file-manager",
                });
                menuItems.push({
                    key: "data",
                    icon: <FaDatabase size={18} />,
                    label: "Sao lưu - Khôi phục",
                    link: "/admin/data",
                });
                menuItems.push({
                    key: "key-payment",
                    icon: <FaKey size={18} />,
                    label: "Key thanh toán",
                    link: "/admin/key-payment",
                });
                // menuItems.push({
                //     key: "language",
                //     icon: <FaLanguage size={18} />,
                //     label: "Ngôn ngữ",
                //     // link: "/admin/language",
                // });
                // menuItems.push({
                //     key: "setting",
                //     icon: <FaGear size={18} />,
                //     label: "Cài đặt",
                //     // link: "/admin/setting",
                // });
                break;
            }

            case TYPE_EMPLOYEE.user: {
                menuItems.push({
                    key: "dashboard",
                    icon: <FaTachometerAlt size={18} />,
                    label: "Bảng Điều Khiển",
                    link: "/user",
                });
                menuItems.push({
                    key: "user",
                    icon: <FaUser size={18} />,
                    label: "Thông tin cá nhân",
                    link: "/user/info",
                });
                menuItems.push({
                    key: "/user/courses",
                    icon: <FaYoutube size={18} />,
                    label: "Khóa học của tôi",
                    link: "/user/courses",
                });
                menuItems.push({
                    key: "orders",
                    icon: <PiIdentificationCardFill size={18} />,
                    label: "Lịch sử mua hàng",
                    link: "/user/orders",
                });
                menuItems.push({
                    key: "change-password",
                    icon: <RiLockPasswordFill size={18} />,
                    label: "Đổi mật khẩu",
                    link: "/user/change-password",
                });
                break;
            }

            default: {
                break;
            }
        }
        menuItems.push({
            key: "home",
            icon: <FaHome size={20} />,
            label: "Trang chủ",
            link: "/",
        });
        menuItems.push({
            key: "logout",
            icon: <FaSignOutAlt size={18} color='red' />,
            label: "Đăng Xuất",
            link: "/logout",
        });
        return menuItems;
    }, [userType]);

    function getInitials(name) {
        return name
            .match(/(\b\S)?/g)
            .join("")
            .match(/(^\S|\S$)?/g)
            .join("")
            .toUpperCase();
    }

    const handleChange = (e) => {
        dispatch(setLanguage(e));
        toastSuccess(`Ngôn ngữ đã được chuyển sang ${e}`);
    };

    const selectedMenu = () => {
        const findMenuKey = (items) =>
            items.reduce((acc, item) => {
                const { link, key, children } = item;
                if (link && window.location.pathname.startsWith(link) && link.length > acc.length) {
                    return { key, length: link.length };
                }
                if (children) {
                    const child = findMenuKey(children);
                    if (child.length > acc.length) {
                        return child;
                    }
                }
                return acc;
            }, { key: null, length: 0 });

        const { key } = findMenuKey(menuSidebars);
        return key ? [key] : [];
    };

    const onClickMenu = (menuLink) => {
        const { link } = menuLink.item.props;

        if (link === '/admin/layout') {
            if (isMobile) {
                toastError('', 'Bạn không thể truy cập trang này!', 'Vui lòng sử dụng máy tính để trãi nghiệm tốt nhất!');
                return;
            }
        }

        const checkLink = (link) => {
            setTimeout(() => {
                if (link != undefined) {
                    navigate(link);
                } else {
                    toastError('', 'Chức năng đang được phát triển');
                }
            }, 200);
        }

        if (isMobile) {
            setOpen(false);
            setTimeout(() => {
                checkLink(link)
            }, 200);
        }

        if (!isMobile) {
            checkLink(link)
        }
    };

    return (
        <HelmetProvider>
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
                <title>{title}</title>
            </Helmet>

            <Layout>
                {isMobile ? (
                    <Drawer
                        width={240}
                        className='menu-admin'
                        title="Chicken War Studio"
                        placement='left'
                        onClose={() => setOpen(false)}
                        open={open}>

                        <Menu
                            mode="inline"
                            className='lg:overflow-scroll'
                            style={{ height: "calc(100vh - 60px)" }}
                            onClick={onClickMenu}
                            selectedKeys={selectedMenu()}
                            items={menuSidebars}
                        />
                    </Drawer>
                ) : (
                    <Sider
                        className={`sider-bar-admin border-r !overflow-hidden ${isMobile ? 'd-none' : ''} `}
                        width={230}
                        style={{ zIndex: 10 }}
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                    >
                        <Button
                            type="link"
                            onClick={() => dispatch(toggleCompact())}
                            icon={collapsed ? <img src='/icon.png' className='size-14' style={{ objectFit: 'cover' }} /> : <StrokeLogo text={'Chicken War'} fontSize={38} />}
                            style={{ width: '100%', height: '55px' }}
                        >
                        </Button>

                        <Menu className='overflow-y-auto'
                            mode="inline"
                            style={{ height: "calc(100vh - 112px)" }}
                            selectedKeys={selectedMenu()}
                            onClick={onClickMenu}
                            items={menuSidebars}
                        />

                        <Button
                            type="link"
                            icon={collapsed ? <TbPlayerTrackNextFilled size={22} /> : <TbPlayerTrackPrevFilled size={22} />}
                            onClick={() => dispatch(toggleCompact())}
                            style={{ width: '100%', height: '56px' }}
                        >
                        </Button>
                    </Sider>
                )}

                <Layout className='h-screen overflow-x-hidden'>
                    {header ? (
                        <>
                            <Header
                                className='header-admin border-b flex justify-between !px-7'
                                style={{
                                    height: '56px',
                                    background: colorBgContainer,
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 100
                                }}>

                                {isMobile && (
                                    <div className="flex items-center" onClick={() => setOpen(true)}>
                                        <FaBars size={22} />
                                    </div>
                                )}

                                <div className='flex items-center'>
                                    <Typography.Title level={4} className='!mb-0'>{header}</Typography.Title>
                                </div>

                                {!isMobile && (
                                    <div className="flex justify-center items-center ml-auto gap-2">
                                        {button}
                                    </div>
                                )}


                                <div className="flex items-center ms-2 gap-2">
                                    {!isMobile && (
                                        <Popover
                                            placement="bottomRight"
                                            title="Ngôn ngữ"
                                            content=
                                            <>
                                                <Select
                                                    value={currentLanguage}
                                                    onChange={handleChange}
                                                    style={{ width: '180px' }}
                                                    placeholder="Thay đổi ngôn ngữ"
                                                    options={languages}
                                                    showSearch
                                                />
                                            </>
                                        >
                                            <div ref={popRef}>
                                                <FaLanguage
                                                    className='cursor-pointer'
                                                    size={30}
                                                />
                                            </div>
                                        </Popover>
                                    )}

                                    {tours && (
                                        <>
                                            <Tooltip placement="bottom" title="Trợ giúp">
                                                <div ref={popRef} onClick={() => setOpenTour(true)}>
                                                    <FaCircleQuestion className='cursor-pointer' size={22} />
                                                </div>
                                            </Tooltip>

                                            <Tour
                                                gap={{ offset: 5, radius: 10 }}
                                                mask={{
                                                    style: {
                                                        boxShadow: 'inset 0 0 15px #333',
                                                    },
                                                    color: darkMode ? "rgba(153, 153, 153, 0.5)" : 'rgba(59, 59, 59, 0.5)',
                                                }}
                                                open={openTour}
                                                onClose={() => setOpenTour(false)}
                                                steps={tours}
                                                disabledInteraction={true}
                                            />
                                        </>
                                    )}

                                    <Tooltip placement="bottom" title="Thông báo">
                                        <div ref={popRef}>
                                            <IoMdNotifications
                                                size={28}
                                                className='cursor-pointer'
                                            />
                                        </div>
                                    </Tooltip>

                                    {userType === 'admin' ? (
                                        <Avatar
                                            className='cursor-pointer'
                                            style={{
                                                backgroundColor: colorPrimary,
                                            }}
                                            icon="AD"
                                        />
                                    ) : (
                                        <Dropdown
                                            trigger={['click']}
                                            menu={{
                                                items: [
                                                    {
                                                        key: 'user',
                                                        label: (
                                                            <div className='flex items-center gap-1' onClick={() => navigate('/user')}>
                                                                <FaTachometerAlt size={18} />
                                                                <Typography.Text>Trang chủ</Typography.Text>
                                                            </div>
                                                        ),
                                                    },
                                                    {
                                                        key: 'info',
                                                        label: (
                                                            <div className='flex items-center gap-1' onClick={() => navigate('/user/info')}>
                                                                <FaUser size={18} />
                                                                <Typography.Text>Thông tin cá nhân</Typography.Text>
                                                            </div>
                                                        ),
                                                    },
                                                    {
                                                        key: 'courses',
                                                        label: (
                                                            <div className='flex items-center gap-1' onClick={() => navigate('/user/courses')}>
                                                                <FaYoutube size={18} />
                                                                <Typography.Text>Khóa học của tôi</Typography.Text>
                                                            </div>
                                                        ),
                                                    },
                                                    {
                                                        key: 'orders',
                                                        label: (
                                                            <div className='flex items-center gap-1' onClick={() => navigate('/user/orders')}>
                                                                <PiIdentificationCardFill size={18} />
                                                                <Typography.Text>Lịch sử mua hàng</Typography.Text>
                                                            </div>
                                                        ),
                                                    },
                                                    {
                                                        key: 'change-password',
                                                        label: (
                                                            <div className='flex items-center gap-1' onClick={() => navigate('/user/change-password')}>
                                                                <RiLockPasswordFill size={18} />
                                                                <Typography.Text>Đổi mật khẩu</Typography.Text>
                                                            </div>
                                                        ),
                                                    },
                                                ]
                                            }}
                                            placement="bottomRight"
                                            arrow={{
                                                pointAtCenter: true,
                                            }}
                                        >
                                            <Avatar
                                                className='cursor-pointer'
                                                style={{
                                                    backgroundColor: colorPrimary,
                                                }}
                                                icon={getInitials('ADmin')}
                                            />
                                        </Dropdown>
                                    )}
                                </div>
                            </Header>

                            <Content
                                style={{
                                    margin: `${margin}px`,
                                }}
                            >
                                {isMobile && button && (
                                    <div
                                        className="flex justify-center items-center gap-2 mb-4"
                                        style={{ marginLeft: 'auto', flexWrap: 'wrap' }}
                                    >
                                        {button}
                                    </div>
                                )}
                                {children}
                            </Content>
                        </>
                    ) : (
                        <Content>
                            {children}
                        </Content>
                    )}
                </Layout>
            </Layout>
        </HelmetProvider>
    );
};
export default LayoutAdmin;