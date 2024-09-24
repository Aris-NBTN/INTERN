import { useEffect, useState } from 'react';
import { Tree, Breadcrumb, Button, Popover, Input, Modal, Empty, Popconfirm, Row, Col } from 'antd';
import { Menu, Item, Separator, Submenu, useContextMenu } from "react-contexify";

import { deepCopyWithoutParent, findLeafKeys, selectAllFile, generateRandomKey } from './Folder';
import LayoutAdmin from '~/components/layout/Admin/Layout';
import { toastError, toastSuccess } from '~/components/toast';

import { baseURL } from '~/utils';

import { Dropzone, FileMosaic, FullScreen, ImagePreview, VideoPreview } from "@files-ui/react";
import { FaFolderPlus, FaFileCirclePlus, FaFilter, FaMagnifyingGlass } from "react-icons/fa6";
import { AiOutlineReload } from "react-icons/ai";
import { FaLongArrowAltUp, FaEdit, FaTrash } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";
import { PiCubeFocusFill } from "react-icons/pi";
import { DownOutlined } from '@ant-design/icons';

import { fileMangerApi, folderMangerApi } from '~/apis/fileMangerApi';

import './Storage.css'

import "react-contexify/dist/ReactContexify.css";

const MENU_ID_1 = "menu-id-1";
const MENU_ID_2 = "menu-id-2";
const MENU_ID_3 = "menu-id-3";
const menuFolder = "menuFolder";

const { DirectoryTree } = Tree;

export default function File_Manager() {
    const { show: showMenu1 } = useContextMenu({ id: MENU_ID_1 }),
        { show: showMenu2 } = useContextMenu({ id: MENU_ID_2 }),
        { show: showMenu3 } = useContextMenu({ id: MENU_ID_3 }),
        { show: showMenuFolder } = useContextMenu({ id: menuFolder })
        ;

    const [selectFiles, setSelectFiles] = useState([]);
    const [selectKey, setSelectKey] = useState();
    const [showFiles, setShowFiles] = useState('uploads');

    const [imageSrc, setImageSrc] = useState(undefined);
    const [videoSrc, setVideoSrc] = useState(undefined);

    const [treeData, setTreeData] = useState([]);
    const [files, setFiles] = useState([]);

    const [breadcrumb, setBreadcrumb] = useState([
        {
            title: 'uploads',
        },
    ]
    );

    const [selectedFile, setSelectedFile] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('');

    const addFolder = () => {
        const newTreeData = deepCopyWithoutParent(treeData);
        const addFolderToNode = (nodes) => {
            for (let node of nodes) {
                if (node.key === selectKey) {
                    node.children = node.children || [];
                    const newKey = generateRandomKey();
                    node.children.push({
                        title: 'Thư mục mới',
                        key: newKey,
                        className: 'non-leaf-node',

                    });
                    return;
                }
                if (node.children) {
                    addFolderToNode(node.children);
                }
            }
        };
        addFolderToNode(newTreeData);
        setTreeData(newTreeData);
    };

    const deleteFolder = () => {
        const newTreeData = deepCopyWithoutParent(treeData);
        const deleteFolderFromNode = (nodes) => {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].key === selectKey) {
                    nodes.splice(i, 1);
                    return;
                }
                if (nodes[i].children) {
                    deleteFolderFromNode(nodes[i].children);
                }
            }
        };
        deleteFolderFromNode(newTreeData);
        setTreeData(newTreeData);
    };

    const onRightClick = ({ event, node }) => {
        event.preventDefault();

        if (!node.isLeaf) {
            showMenu1({
                event: event,
            });
            setSelectKey(node.key)
        } else if (selectFiles.length === 0) {
            if (node.parent) {
                setSelectKey(node.parent.key)
            }
            showMenu1({
                event: event,
            });
        }
        else {
            setSelectKey(node.parent.key)
            showMenu2({
                event: event,
            });
        }
    };

    const handleSee = (imageSource) => {
        setImageSrc(imageSource);
    };

    const handleWatch = (videoSource) => {
        setVideoSrc(videoSource);
    };

    // File
    const [extFiles, setExtFiles] = useState([]);
    const handleDownload = async (name, downloadUrl) => {
        if (!downloadUrl) return;
        try {
            const image = await fetch(downloadUrl);
            if (!image.ok) {
                toastError("Tải xuống bị lỗi", "File không tồn tại hoặc đã bị xóa khỏi hệ thống");
                return;
            }
            const imageBlob = await image.blob();
            const imageURL = URL.createObjectURL(imageBlob);

            const anchor = document.createElement("a");
            anchor.href = imageURL;
            anchor.download = name || "newFile.jpeg";

            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(imageURL);

        } catch (error) {
            toastError("Tải xuống bị lỗi", "File không tồn tại hoặc đã bị xóa khỏi hệ thống");
        }
    };
    const onDeleteDropZone = (id) => {
        setExtFiles(extFiles.filter((x) => x.id !== id));
    };
    const updateFilesDropZone = (incommingFiles) => {
        setExtFiles(incommingFiles);
    };
    const handleSeeDropZone = (imageSource) => {
        setImageSrc(imageSource);
    };
    const handleWatchDropZone = (videoSource) => {
        setVideoSrc(videoSource);
    };

    // Folder
    // const [modalAddFolder, setModalAddFolder] = useState(false);
    const [modalFolder, setModalFolder] = useState([false, false]);
    const [folderName, setFolderName] = useState('');
    const [folderReName, setFolderReName] = useState('');
    const toggleModalFolder = (idx, target) => {
        setModalFolder((p) => {
            p[idx] = target;
            return [...p];
        });
    };


    // File
    const [modalAddFile, setModalAddFile] = useState(false);
    const handleShowFile = (name) => {
        setShowFiles(name);
        setBreadcrumb(formatBreadcrumb(name))
        fetchData(name);
    }

    // Format
    const transformData = (data, parentPath = '') => {
        const transformNode = (node, parentPath) => {
            const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;
            if (node.type === 'file') {
                return {
                    title: node.name,
                    key: node.path,
                    isLeaf: true
                };
            } else if (node.type === 'directory') {
                const children = node.children ? node.children.map(child => transformNode(child, fullPath)) : [];
                // Sort children: directories first, then files
                children.sort((a, b) => (a.isLeaf === b.isLeaf ? 0 : a.isLeaf ? 1 : -1));
                return {
                    title: node.name,
                    key: node.path,
                    className: 'non-leaf-node',
                    path: fullPath,
                    children: children
                };
            }
        };

        return transformNode(data, parentPath);
    }

    const formatData = (data) => {
        data.sort((a, b) => {
            if (a.type === 'directory' && b.type === 'file') {
                return -1;
            } else if (a.type === 'file' && b.type === 'directory') {
                return 1;
            } else {
                return 0;
            }
        });

        return data.map(item => {
            let type = item.type === 'file' ? item.mimeType : 'folder';
            if (item.type === 'file') {
                return {
                    name: item.name,
                    type: type,
                    size: item.size,
                    url: `${baseURL}/${item.path}`,
                    downloadUrl: `${baseURL}/${item.path}`,
                };
            } else if (item.type === 'directory') {
                return {
                    name: item.name,
                    type: type,
                    size: item.size,
                    children: item.children ? formatData(item.children) : []
                };
            }
        });
    }
    const formatBreadcrumb = (path) => {
        const parts = path.split('/');
        const result = parts.map((part, index) => {
            let obj = {
                title: part
            };
            if (index < parts.length - 1) {
                obj.href = '#';
            }
            return obj;
        });
        return result;
    };

    useEffect(() => {
        fileMangerApi.allFile().then((data) => {
            setTreeData([transformData(data)]);
        });
    }, [])

    const fetchData = (showFiles) => {
        fileMangerApi.filesInFolder({ folderName: showFiles }).then((data) => {
            setFiles(formatData(data));
        });
    }

    useEffect(() => {
        fetchData(showFiles);
    }, [])

    return (
        <LayoutAdmin
            header={
                <div className='flex items-center h-full'>
                    <h6 className='mb-0'>QUẢN LÝ FILE</h6>
                </div>
            }
        >
            <div style={{ height: 'calc(100vh - 132px)' }} onClick={() => setSelectedFile(null)}>
                <div className="row px-0 border-bottom pb-2">
                    <div className="flex flex-col md:flex-row justify-between items-center overflow-hidden">
                        <div className="flex">
                            <Button
                                onClick={() => toggleModalFolder(0, true)}
                                type="text"
                                block
                            >
                                Thêm thư mục <FaFolderPlus size={20} />
                            </Button>
                            <Button type="text" block onClick={() => setModalAddFile(true)}>
                                Thêm file <FaFileCirclePlus size={20} />
                            </Button>
                            <Button type="text" block>
                                Thêm file 3D <PiCubeFocusFill size={25} />
                            </Button>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                addonAfter={<FaMagnifyingGlass size={20} />}
                                placeholder='Nhập tên file'
                                style={{ width: '200px' }}
                            />
                            <Button
                                style={{ width: '100px' }}
                                type="text"
                                block
                            >
                                <Popover
                                    placement="bottomRight"
                                    title={"Chọn loại tệp"}
                                    content={
                                        <Tree
                                            checkable
                                            defaultExpandAll
                                            treeData={[
                                                {
                                                    title: 'Chọn tất cả',
                                                    key: 'all',
                                                    children: [
                                                        {
                                                            title: 'PNG',
                                                            key: 'png',
                                                        },
                                                        {
                                                            title: 'JPG',
                                                            key: 'jpg',
                                                        },
                                                        {
                                                            title: 'GLB',
                                                            key: 'glb',
                                                        },
                                                    ],
                                                },
                                            ]}
                                            blockNode />
                                    }
                                >
                                    <div className='flex gap-2'>
                                        Lọc
                                        <FaFilter size={20} />
                                    </div>
                                </Popover>
                            </Button>
                            <Button
                                style={{ width: '100px' }}
                                type="text"
                                block
                            >
                                Tải lại <AiOutlineReload size={20} />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <Row >
                        <Col md={{ span: 6 }} span={24}>
                            <DirectoryTree
                                className='overflow-auto p-2'
                                style={{ height: 'calc(100vh - 160px)' }}
                                showLine
                                defaultExpandAll={true}
                                switcherIcon={<DownOutlined className='fs-7' />}
                                onSelect={() => console.log('onSelect')}
                                onClick={(keys, info) => {
                                    if (info?.isLeaf == null) {
                                        handleShowFile(info.path)
                                    }
                                }}
                                onRightClick={onRightClick}
                                treeData={treeData}
                            />
                        </Col>

                        <Col
                            className='overflow-auto p-2'
                            style={{ height: 'calc(100vh - 160px)' }}
                            md={{ span: 18 }} span={24}
                            onContextMenu={(event) => {
                                showMenuFolder({
                                    event: event,
                                });
                            }}
                        >
                            <Row >
                                <Col
                                    className='flex justify-center items-center'
                                    xxl={{ span: 2 }} xl={{ span: 4 }} md={{ span: 6 }}
                                >
                                    <Button
                                        onClick={() => handleShowFile(showFiles.substring(0, showFiles.lastIndexOf("/")))}
                                        disabled={showFiles === 'uploads' || showFiles === '' ? true : false}
                                        type="text"
                                        block
                                    >
                                        <FaLongArrowAltUp size={20} />
                                    </Button>
                                </Col>

                                <Col
                                    xxl={{ span: 22 }} xl={{ span: 20 }} md={{ span: 18 }}
                                >
                                    <Breadcrumb
                                        className='fs-6'
                                        separator=">"
                                        items={breadcrumb} />
                                </Col>
                            </Row>

                            <Row >
                                {files.length === 0 ? (
                                    <Col span={24}>
                                        <Empty />
                                    </Col>
                                ) : (
                                    files.map((item) => (
                                        <Col
                                            key={item.name}
                                            xl={{ span: 4 }}
                                            lg={{ span: 6 }}
                                            md={{ span: 8 }}
                                            span={12}
                                            className='flex justify-center items-center mb-2'
                                        >
                                            {item.type === 'folder' ? (
                                                <div className='hover-folder position-relative'>
                                                    <img
                                                        className='folder-img position-relative'
                                                        onDoubleClick={() => {
                                                            handleShowFile(`${showFiles}/${item.name}`);
                                                        }}
                                                        onContextMenu={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            setSelectedFolder(item);
                                                            showMenu3({
                                                                event: event,
                                                            });
                                                        }}
                                                        src={`${baseURL}/system/file/folder.png`}
                                                        alt="Hình ảnh folder"
                                                    />
                                                    <div className="position-absolute folder-name">{item.name}</div>
                                                </div>
                                            ) : (
                                                <FileMosaic
                                                    className={`hover-file h-full ${selectedFile && selectedFile.url === item.url ? 'selected' : ''}`}
                                                    name={item.name}
                                                    type={item.type}
                                                    size={item.size}
                                                    imageUrl={item.url}
                                                    smartImgFit="center"
                                                    onDownload={() => handleDownload(item.name, item.downloadUrl)}
                                                    onSee={item.type.startsWith('video/') ? handleWatch : item.type.startsWith('image/') ? handleSee : undefined}
                                                    onRightClick={(event) => {
                                                        setSelectedFile(item);
                                                        event.stopPropagation();
                                                        showMenu3({
                                                            event: event,
                                                        });
                                                    }}
                                                    onClick={() => {
                                                        setSelectedFile(item);
                                                    }}
                                                />
                                            )}
                                        </Col>
                                    ))
                                )}
                            </Row>
                        </Col>
                    </Row>
                </div>

                <Modal
                    title="Thêm file"
                    centered
                    open={modalAddFile}
                    onOk={() => setModalAddFile(false)}
                    onCancel={() => setModalAddFile(false)}
                    width={1000}
                    footer={null}
                >
                    <Dropzone
                        onChange={updateFilesDropZone}
                        minHeight="195px"
                        value={extFiles}
                        maxFiles={0}
                        maxFileSize={5 * 1024 * 1024}
                        label="Kéo và thả tập tin vào đây hoặc nhấp để thêm tập tin"

                    >
                        {extFiles.map((file) => (
                            <FileMosaic
                                {...file}
                                key={file.id}
                                onDelete={onDeleteDropZone}
                                onSee={handleSeeDropZone}
                                onWatch={handleWatchDropZone}
                                resultOnTooltip
                                alwaysActive
                                preview
                                info
                            />
                        ))}
                    </Dropzone>
                </Modal>

                {/* Folder */}
                <Modal
                    title="Tạo thư mục"
                    centered
                    open={modalFolder[0]}
                    onOk={() => {
                        folderMangerApi.createFolder({ name: folderName, parentPath: showFiles })
                            .then(() => {
                                toastSuccess("Tạo thư mục thành công", "Tạo thư mục mới thành công");
                                fetchData(showFiles);
                            }).catch(() => {
                                toastError("Tạo thư mục thất bại", "Có lỗi xảy ra khi tạo thư mục mới");
                            })
                        setFolderName('');
                        toggleModalFolder(0, false)
                    }}
                    closeIcon={false}
                    onCancel={() => toggleModalFolder(0, false)}
                    width={500}
                >
                    <Input
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        placeholder="Nhập tên thư mục"
                    />
                </Modal>

                <Modal
                    title="Chỉnh sửa tên thư mục"
                    centered
                    open={modalFolder[1]}
                    onOk={() => {
                        console.log(selectedFolder);
                        folderMangerApi.updateFolder({ oldName: selectedFolder.name, newName: folderReName, parentPath: showFiles })
                            .then(() => {
                                setSelectedFolder('')
                                toastSuccess("Đổi tên thư mục thành công", "Đổi tên thư mục thành công");
                                fetchData(showFiles);
                            })
                            .catch((error) => console.log(error));
                        setFolderReName('');
                        toggleModalFolder(1, false)
                    }}
                    closeIcon={false}
                    onCancel={() => toggleModalFolder(1, false)}
                    width={500}
                >
                    <Input
                        value={folderReName}
                        onChange={(e) => setFolderReName(e.target.value)}
                        placeholder="Nhập tên thư mục"
                    />
                </Modal>
                {/* Folder */}

                <Menu id={MENU_ID_1}>
                    <Item onClick={addFolder}>
                        <i className="fa-light fa-folder-plus me-2 fs-4"></i> Thêm thư mục
                    </Item>
                    <Item onClick={deleteFolder}>
                        <i className="fa-light fa-folder-minus me-2 fs-4"></i> Xóa thư mục
                    </Item>
                    <Separator />
                    <Item>
                        <i className="fa-light fa-file-signature me-2 fs-4"></i>  Đổi tên thư mục
                    </Item>
                    <Separator />
                    <Item>
                        <i className="fa-light fa-file-plus me-2 fs-4"></i> Tải file lên
                    </Item>
                    <Separator />
                    <Submenu label="Thông tin">
                        <Item>Ngày tạo: </Item>
                        <Item>Kích thước: </Item>
                        <Item>Bao gồm: </Item>
                    </Submenu>
                </Menu>

                <Menu id={MENU_ID_2}>
                    <Item>
                        <i className="fa-solid fa-check me-2 fs-4"></i> Chọn nhiều file
                    </Item>
                    <Item onClick={() => {
                        selectAllFile(treeData, selectKey, findLeafKeys, setSelectFiles)
                    }}>
                        <i className="fa-solid fa-check-double me-2 fs-4"></i> Chọn toàn bộ file
                    </Item>
                    <Item onClick={() => setSelectFiles([])}><i className="fa-solid fa-x me-2 fs-4"></i> Bỏ chọn</Item>
                    <Separator />
                    <Item>
                        <i className="fa-solid fa-download fs-4 me-2"></i>Tải file xuống
                    </Item>
                    <Item>
                        <i className="fa-solid fa-trash fs-4 me-2"></i> Xóa file
                    </Item>
                </Menu>

                <Menu
                    style={{ width: '100px' }}
                    animation='scale'
                    id={MENU_ID_3}>
                    <Submenu label=<><IoInformationCircle size={22} /> Thông tin: </>>
                        <Item>Kích thước: </Item>
                        <Item>Loại file: </Item>
                        <Item>Link: </Item>
                    </Submenu>
                    <Separator />
                    <Item onClick={() => toggleModalFolder(1, true)}><FaEdit size={22} />Chỉnh sửa file</Item>
                    <Separator />

                    <Popconfirm
                        placement="bottom"
                        onConfirm={() => {
                            folderMangerApi.deleteFolder({ namefolder: selectedFolder.name, parentPath: showFiles })
                                .then(() => toastSuccess("Xóa thư mục thành công", "Xóa thư mục thành công"))
                                .catch(() => toastError("Xóa thư mục thất bại", "Có lỗi xảy ra khi xóa thư mục"));
                            console.log(selectedFolder)
                            console.log(showFiles)
                        }}
                        title={`Bạn có chắc chắn muốn xóa file này không?`}
                    >
                        <Item>
                            <FaTrash size={22} />Xóa file
                        </Item>
                    </Popconfirm>
                </Menu>

                <Menu
                    style={{ width: '100px' }}
                    animation='scale'
                    id={menuFolder}>
                    <Item onClick={() => toggleModalFolder(0, true)}><FaFolderPlus size={20} className='me-1' /> Thêm thư mục</Item>
                    <Item onClick={() => setModalAddFile(true)}><FaFileCirclePlus size={20} className='me-1' />Thêm file </Item>
                    <Item ><PiCubeFocusFill size={22} className='me-1' />Thêm file 3D</Item>
                </Menu>

                <FullScreen
                    open={imageSrc !== undefined}
                    onClose={() => setImageSrc(undefined)}
                >
                    <ImagePreview src={imageSrc} />
                </FullScreen>

                <FullScreen
                    open={videoSrc !== undefined}
                    onClose={() => setVideoSrc(undefined)}
                >
                    <VideoPreview src={videoSrc} autoPlay controls />
                </FullScreen>
            </div>
        </LayoutAdmin >
    );
}