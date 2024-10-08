import { useEffect, useRef, useState } from 'react';
import { Avatar, Drawer, Menu, theme } from 'antd';

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '~/redux/slices/menuSlice';

import './Layout.css';
import 'animate.css';
import { useNavigate } from 'react-router-dom';
import { FaMailBulk, FaPhoneAlt } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { createRoot } from 'react-dom/client';
import { getInfoApi } from '~/redux/slices/Data/infoSlice';

const LayoutPublic = ({
    title,
    description,
    keywords,
    author,
    ldJson = {},
    children
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token: { colorPrimary } } = theme.useToken();

    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    const menuItems = useSelector((state) => state.menu);
    const menuStatus = useSelector((state) => state.menu.status);
    const { user } = useSelector((state) => state.auth);
    const { info, loading } = useSelector(state => state.info);

    const menuMobile = (data) => {
        try {
            if (!data) return [];

            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');

            const menuItems = [];
            const mainMenuItems = doc.querySelectorAll('.nav__menu > ul > li');

            mainMenuItems.forEach(mainItem => {
                if (!mainItem) return;

                const mainLink = mainItem.querySelector('.nav__link > a');
                if (!mainLink) return;

                const mainMenuData = {
                    key: mainLink.getAttribute('href') || '#',
                    label: mainLink.textContent?.trim() || '',
                };

                const subMenuItems = mainItem.querySelectorAll('.dropdown__menu.dropdown-aris > li');
                const children = [];

                subMenuItems.forEach(subItem => {
                    if (!subItem) return;

                    const subLink = subItem.querySelector('.dropdown__link > h4 > a');
                    if (!subLink) return;

                    const childMenuData = {
                        key: subLink.getAttribute('href') || '#',
                        label: subLink.textContent?.trim() || '',
                        children: []
                    };

                    const subSubMenuItems = subItem.querySelectorAll('.dropdown__submenu.dropdown-aris > li > a');
                    subSubMenuItems.forEach(subSubItem => {
                        if (!subSubItem) return;

                        childMenuData.children.push({
                            key: subSubItem.getAttribute('href') || '#',
                            label: subSubItem.textContent?.trim() || '',
                        });
                    });

                    if (childMenuData.children.length > 0) {
                        children.push(childMenuData);
                    } else {
                        children.push({
                            label: childMenuData.label,
                            key: childMenuData.key
                        });
                    }
                });

                if (children.length > 0) {
                    mainMenuData.children = children;
                }

                menuItems.push(mainMenuData);
            });

            return menuItems;
        } catch (error) {
            console.error('Error parsing menu:', error);
            return [];
        }
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
        if (user?.userType && userIcon) {
            userIcon.innerHTML = '';
            if (!rootRef.current) {
                rootRef.current = createRoot(userIcon);
            }
            const root = rootRef.current;

            const renderAvatar = () => {
                if (user?.avatar) {
                    return <Avatar src={user?.avatar} size={40} />;
                }
                return (
                    <Avatar style={{ backgroundColor: colorPrimary }} size={40}> {getInitials(user?.name)} </Avatar>
                );
            };

            root.render(
                <>  {renderAvatar()} </>
            );
        }
    }, [user, menuItems, colorPrimary]);

    useEffect(() => {
        if (loading) {
            dispatch(getInfoApi());
        }
    }, []);

    return (
        <HelmetProvider>
            <Helmet>
                <meta name="description" content={description || info[0]?.description} />
                <meta name="keywords" content={keywords || info[0]?.keywords} />
                <meta name="author" content={author || info[0]?.manage} />
                <title>{title || info[0]?.name}</title>

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

            <div style={{ minHeight: '90dvh' }}>
                {children}
            </div>
            <div dangerouslySetInnerHTML={{ __html: menuItems?.menuItems?.footer }} />

            <Drawer
                title={info?.newData?.[0]?.name}
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
                            {info?.newData?.[0]?.email}
                        </div>
                        <div className="flex items-center gap-2 my-2">
                            <FaPhoneAlt size={22} />
                            {info?.newData?.[0]?.phone}
                        </div>
                        <div className="flex items-center gap-2 my-2">
                            <FaLocationDot size={22} />
                            {info?.newData?.[0]?.address}
                        </div>
                    </div>
                </div>

            </Drawer>
        </HelmetProvider>
    );
};
export default LayoutPublic;