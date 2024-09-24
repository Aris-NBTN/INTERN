import { useEffect, useRef, useState } from 'react';
import { Avatar, Drawer, Dropdown, Menu, theme, Typography } from 'antd';

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '~/redux/slices/menuSlice';

import './Layout.css';
import 'animate.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMailBulk, FaPhoneAlt, FaTachometerAlt } from 'react-icons/fa';
import { FaLocationDot, FaUser, FaYoutube } from 'react-icons/fa6';
import { createRoot } from 'react-dom/client';
import { PiIdentificationCardFill } from 'react-icons/pi';
import { RiLockPasswordFill } from 'react-icons/ri';

const LayoutPublic = ({
    title = "Chicken War Studio",
    description = "Chicken War Studio",
    keywords = "3D",
    author = "Chicken War Studio",
    ldJson = {},
    children
}) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const { token: { colorPrimary } } = theme.useToken();

    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    const menuItems = useSelector((state) => state.menu);
    const menuStatus = useSelector((state) => state.menu.status);
    const { user } = useSelector((state) => state.auth);

    const menuMobile = (data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        const menuItems = [];
        const mainMenuItems = doc.querySelectorAll('.nav__menu > ul > li');

        mainMenuItems.forEach(mainItem => {
            const mainLink = mainItem.querySelector('.nav__link > a');
            const mainMenuData = {
                key: mainLink.getAttribute('href'),
                label: mainLink.textContent.trim(),
            };

            // Lấy menu con
            const subMenuItems = mainItem.querySelectorAll('.dropdown__menu.dropdown-aris > li');

            const children = [];

            subMenuItems.forEach(subItem => {
                const subLink = subItem.querySelector('.dropdown__link > h4 > a');
                const childMenuData = {
                    key: subLink.getAttribute('href'),
                    label: subLink.textContent.trim(),
                    children: []
                };

                // Lấy menu con cấp hai (nếu có)
                const subSubMenuItems = subItem.querySelectorAll('.dropdown__submenu.dropdown-aris > li > a');
                subSubMenuItems.forEach(subSubItem => {
                    childMenuData.children.push({
                        key: subSubItem.getAttribute('href'),
                        label: subSubItem.textContent.trim(),
                    });
                });

                if (childMenuData.children.length > 0) {
                    children.push(childMenuData);
                } else {
                    // Nếu không có children, chỉ thêm label và href
                    children.push({ label: childMenuData.label, key: childMenuData.key });
                }
            });

            // Chỉ thêm children nếu không rỗng
            if (children.length > 0) {
                mainMenuData.children = children;
            }

            menuItems.push(mainMenuData);
        });

        return menuItems;
    };

    function getInitials(name) {
        return name
            .match(/(\b\S)?/g)
            .join("")
            .match(/(^\S|\S$)?/g)
            .join("")
            .toUpperCase();
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const handleLinkClick = (event) => {
            const target = event.target.closest('a');
            if (target && target.href) {
                const url = new URL(target.href);
                const relativePath = url.pathname + url.search + url.hash;
                if (url.origin === window.location.origin) {
                    event.preventDefault();
                    navigate(relativePath);
                }
            }
        };

        const container = document.getElementById('root');
        if (container) {
            container.addEventListener('click', handleLinkClick);
        }

        return () => {
            if (container) {
                container.removeEventListener('click', handleLinkClick);
            }
        };
    }, [navigate]);

    useEffect(() => {
        if (menuStatus === 'idle') {
            dispatch(fetchMenu());
        }
    }, [dispatch, menuStatus]);

    useEffect(() => {
        if (menuItems?.menuItems?.header) {
            const mobileMenuIcon = document.getElementById('menu-mobile');
            const handleClick = () => setOpen(true);
            if (mobileMenuIcon) {
                mobileMenuIcon.addEventListener('click', handleClick);
            }
            return () => {
                if (mobileMenuIcon) {
                    mobileMenuIcon.removeEventListener('click', handleClick);
                }
            };
        }
    }, [menuItems]);

    useEffect(() => {
        const userIcon = document.getElementById('icon-user');
        if (user?.userType && userIcon && user?.userType != 'admin') {
            userIcon.innerHTML = '';
            if (!rootRef.current) {
                rootRef.current = createRoot(userIcon);
            }
            const root = rootRef.current;

            const menuItems = [
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
            ];

            const renderAvatar = () => {
                if (user?.src) {
                    return <Avatar src={user?.src} size={40} />;
                }
                return (
                    <Avatar style={{ backgroundColor: colorPrimary }} size={40}>
                        {getInitials(user?.name)}
                    </Avatar>
                );
            };

            root.render(
                <Dropdown
                    menu={{ items: menuItems }}
                    placement="bottomRight"
                    arrow={{ pointAtCenter: true }}
                >
                    {renderAvatar()}
                </Dropdown>
            );
        }
    }, [user, menuItems]);

    return (
        <HelmetProvider>
            <Helmet>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
                <title>{title}</title>
                {typeof ldJson === 'object' && Object.keys(ldJson).length > 0 && (
                    <script type="application/ld+json">{JSON.stringify(ldJson)}</script>
                )}
            </Helmet>

            {menuItems?.menuItems?.css && (
                <>
                    <style dangerouslySetInnerHTML={{ __html: menuItems?.menuItems?.css }} />
                </>
            )}

            {menuItems?.menuItems?.header && (
                <>
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500 }} >
                        <div dangerouslySetInnerHTML={{ __html: menuItems?.menuItems?.header }} />
                    </div>
                </>
            )}

            <div style={{ minHeight: 'calc(93vh - 6rem)' }}>
                {children}
            </div>
            <div dangerouslySetInnerHTML={{ __html: menuItems?.menuItems?.footer }} />

            <Drawer
                title="Chicken War Studio"
                placement='left'
                onClose={() => setOpen(false)}
                open={open}
                width={256} >

                <div className="flex flex-col justify-between" style={{ height: "100%" }}>
                    <Menu
                        mode="inline"
                        onClick={(item) => {
                            setOpen(false);
                            setTimeout(() => {
                                navigate(item.key);
                            }, 500);
                        }}
                        style={{
                            width: 256,
                        }}
                        items={menuMobile(menuItems?.menuItems?.header)}
                    />

                    <div className="p-2">
                        <div className="flex items-center gap-2 my-2">
                            <FaMailBulk size={22} />
                            {/* {inFo?.info?.email} */}
                        </div>
                        <div className="flex items-center gap-2 my-2">
                            <FaPhoneAlt size={22} />
                            {/* {inFo?.info?.phoneNumber} */}
                        </div>
                        <div className="flex items-center gap-2 my-2">
                            <FaLocationDot size={22} />
                            {/* {inFo?.info?.address} */}
                        </div>
                    </div>
                </div>

            </Drawer>
        </HelmetProvider>
    );
};
export default LayoutPublic;