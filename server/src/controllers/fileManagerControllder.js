import { StatusCodes } from 'http-status-codes';
import dirTree from 'directory-tree';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';

const allFile = async (req, res, next) => {
    try {
        const tree = dirTree(path.join(__dirname, '../public/uploads',), { attributes: ['type', 'size', 'extension'] });
        res.status(StatusCodes.OK).json(tree);
    } catch (error) {
        next(error);
    }
}

const getAllImages = async (req, res, next) => {
    try {
        const tree = dirTree(path.join(__dirname, '../public/uploads'), {
            attributes: ['type', 'size', 'extension']
        });

        const filterImages = (node) => {
            if (node.type === 'directory') {
                return node.children.flatMap(filterImages);
            } else {
                const mimeType = mime.lookup(node.name);
                if (mimeType && mimeType.startsWith('image/')) {
                    return [{
                        path: node.path.replace(/\\/g, '/').replace(path.join(__dirname, '../public/').replace(/\\/g, '/'), '/'),
                        name: node.name,
                        mimeType,
                        size: node.size,
                        extension: node.extension
                    }];
                }
                return [];
            }
        };

        // Get all images from the tree
        const images = filterImages(tree);

        // Respond with the images
        res.status(StatusCodes.OK).json(images);
    } catch (error) {
        next(error);
    }
};

const filterFileType = async (req, res, next) => {
    try {
        const { fileTypes } = req.body;
        if (!fileTypes || !Array.isArray(fileTypes) || fileTypes.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'fileTypes is required and should be a non-empty array.' });
        }

        const tree = dirTree(path.join(__dirname, '../public/uploads'), {
            extensions: new RegExp(`\\.(${fileTypes.join('|')})$`),
            attributes: ['type', 'size', 'extension']
        });

        res.status(StatusCodes.OK).json(tree);
    } catch (error) {
        next(error);
    }
};

const filesInFolder = async (req, res, next) => {
    try {
        const { folderName } = req.body;
        if (!folderName) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'FolderName is required.' });
        }

        const folderPath = path.join(__dirname, '../public/', folderName);
        const tree = dirTree(folderPath, {
            attributes: ['type', 'size', 'extension']
        });

        if (!tree || tree.type !== 'directory') {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Folder not found or it is not a directory.' });
        }

        const formatPath = (filePath) => {
            return filePath
                .replace(/\\/g, '/')
                .replace(`${path.join(__dirname, '../public/').replace(/\\/g, '/')}`, `/`);
        };

        const formatTree = (node) => {
            if (node.type === 'directory') {
                return {
                    ...node,
                    path: formatPath(node.path),
                    children: node.children.map(formatTree)
                };
            } else {
                return {
                    ...node,
                    path: formatPath(node.path),
                    mimeType: mime.lookup(node.name) || 'application/octet-stream'
                };
            }
        };

        const formattedTree = formatTree(tree);

        res.status(StatusCodes.OK).json(formattedTree.children);
    } catch (error) {
        next(error);
    }
};

const addFolder = async (req, res, next) => {
    try {
        const { name, parentPath } = req.body;
        if (!name || !parentPath) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Name and parentPath are required.' });
        }

        const folderPath = path.join(__dirname, '../public/', parentPath, name);

        if (fs.existsSync(folderPath)) {
            return res.status(StatusCodes.CONFLICT).json({ error: 'Folder already exists.' });
        }

        fs.mkdirSync(folderPath, { recursive: true });

        res.status(StatusCodes.CREATED).json({ message: 'Folder created successfully.', path: folderPath });
    } catch (error) {
        next(error);
    }
};

const renameFolder = async (req, res, next) => {
    try {
        const { oldName, newName, parentPath } = req.body;
        if (!oldName || !newName || !parentPath) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'oldName, newName, and parentPath are required.' });
        }

        const oldFolderPath = path.join(__dirname, '../public/', parentPath, oldName);
        const newFolderPath = path.join(__dirname, '../public/', parentPath, newName);

        if (!fs.existsSync(oldFolderPath)) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'The old folder does not exist.' });
        }

        if (fs.existsSync(newFolderPath)) {
            return res.status(StatusCodes.CONFLICT).json({ error: 'The new folder name already exists.' });
        }

        fs.renameSync(oldFolderPath, newFolderPath);

        res.status(StatusCodes.OK).json({ message: 'Folder renamed successfully.', path: newFolderPath });
    } catch (error) {
        next(error);
    }
};

const deleteFolder = async (req, res, next) => {
    try {
        const { namefolder, parentPath } = req.body;
        console.log(namefolder, parentPath);
        if (!namefolder || !parentPath) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Name and parentPath are required.' });
        }

        const folderPath = path.join(__dirname, '../public/', parentPath, namefolder);

        if (!fs.existsSync(folderPath)) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Folder not found.' });
        }

        fs.rmdirSync(folderPath, { recursive: true });

        res.status(StatusCodes.OK).json({ message: 'Folder deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

export const fileManagerController = {
    allFile,
    getAllImages,
    filterFileType,
    filesInFolder,
}

export const folderManagerController = {
    addFolder,
    renameFolder,
    deleteFolder
}
