import pageSchema from "~/models/pagesModel.js";
import masonrySchema from "~/models/masonryModel";
import { addData, updateData, deleteData, getData, getSigData } from "./indexControllder";

const nameMess = 'Bài viết';

const sigPage = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const results = await getSigData(nameMess, { slug: slug }, pageSchema, { select: '_id name title description title keywords content' });
        res.status(results.status).json(results.message);
    } catch (error) {
        next(error);
    }
}

const sigPageEdit = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const results = await getSigData(nameMess, { slug: slug }, pageSchema, { select: '_id name slug edit' });
        res.status(results.status).json(results.message);
    } catch (error) {
        next(error);
    }
}

const allPage = async (req, res, next) => {
    try {
        const results = await getData(nameMess, pageSchema, {
            sort: { createdAt: -1 },
            select: '_id slug key name title description keywords group'
        });
        res.status(results.status).json(results.message);
    } catch (error) {
        next(error);
    }
}

const addPage = async (req, res, next) => {
    try {
        const result = await addData(nameMess, pageSchema, req.body, { uniqueField: 'name', customSlugField: 'name' });
        res.status(result.status).json({ message: result.message, newData: result.data });
    } catch (error) {
        next(error);
    }
}

const putPage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await updateData(nameMess, pageSchema, id, req.body, { uniqueField: 'name' });
        res.status(result.status).json({ message: result.message, newData: result.data });
    } catch (error) {
        next(error);
    }
}

const copyPage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const originalPage = await pageSchema.findById(id);

        if (!originalPage) {
            return res.status(404).json({ message: 'Trang không tồn tại.' });
        }
        const newPageData = {
            ...originalPage.toObject(),
            name: `${originalPage.name} - Copy`,
            slug: `${originalPage.slug}-copy`,
        };
        delete newPageData._id;

        const result = await addData(nameMess, pageSchema, newPageData, { uniqueField: 'name', customSlugField: 'name' });
        res.status(result.status).json({ message: 'Trang đã được sao chép thành công.', newData: result.data });
    } catch (error) {
        next(error);
    }
}

const delPage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteData(nameMess, pageSchema, id);
        res.status(result.status).json({ message: result.message, _id: id });
    } catch (error) {
        next(error);
    }
}

const replaceInObject = (obj, oldBaseUrl, newBaseUrl) => {
    if (typeof obj === 'string') {
        return obj.replace(new RegExp(oldBaseUrl, 'gi'), newBaseUrl);
    } else if (Array.isArray(obj)) {
        return obj.map(item => replaceInObject(item, oldBaseUrl, newBaseUrl));
    } else if (typeof obj === 'object') {
        const updatedObject = {};
        for (const [key, value] of Object.entries(obj)) {
            updatedObject[key] = replaceInObject(value, oldBaseUrl, newBaseUrl);
        }
        return updatedObject;
    }
    return obj;
};

const changeText = async (req, res, next) => {
    const { oldDomain, newDomain } = req.body;

    if (!oldDomain || !newDomain) {
        return res.status(400).json({ error: 'Vui lòng cung cấp cả oldDomain và newDomain' });
    }

    try {
        const updatePageResult = await pageSchema.updateMany(
            {
                $or: [
                    { 'content.html': { $regex: oldDomain, $options: 'i' } },
                    { 'content.css': { $regex: oldDomain, $options: 'i' } },
                    { 'content.js': { $regex: oldDomain, $options: 'i' } }
                ]
            },
            [
                {
                    $set: {
                        'content.html': {
                            $replaceAll: {
                                input: '$content.html',
                                find: oldDomain,
                                replacement: newDomain
                            }
                        },
                        'content.css': {
                            $replaceAll: {
                                input: '$content.css',
                                find: oldDomain,
                                replacement: newDomain
                            }
                        },
                        'content.js': {
                            $replaceAll: {
                                input: '$content.js',
                                find: oldDomain,
                                replacement: newDomain
                            }
                        }
                    }
                }
            ]
        );

        // Cập nhật trường 'edit' trong model Page
        const pages = await pageSchema.find({ 'edit': { $type: 'object' } });
        let updatedPagesCount = 0;

        for (const page of pages) {
            if (page.edit) {
                const editString = JSON.stringify(page.edit);
                if (editString.includes(oldDomain)) {
                    const updatedEditString = editString.replace(new RegExp(oldDomain, 'g'), newDomain);
                    page.edit = JSON.parse(updatedEditString);
                    await page.save();
                    updatedPagesCount++;
                }
            }
        }

        // Cập nhật model Masonry
        const updateMasonryResult = await masonrySchema.updateMany(
            { 'img.imgSrc': { $regex: oldDomain, $options: 'i' } },
            [
                {
                    $set: {
                        'img': {
                            $map: {
                                input: '$img',
                                as: 'image',
                                in: {
                                    $mergeObjects: [
                                        '$$image',
                                        {
                                            imgSrc: {
                                                $replaceAll: {
                                                    input: '$$image.imgSrc',
                                                    find: oldDomain,
                                                    replacement: newDomain
                                                }
                                            },
                                            link: {
                                                $replaceAll: {
                                                    input: '$$image.link',
                                                    find: oldDomain,
                                                    replacement: newDomain
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        );

        const totalUpdated = updatePageResult.modifiedCount + updatedPagesCount + updateMasonryResult.modifiedCount;

        res.json({
            message: 'Cập nhật thành công',

        });

    } catch (error) {
        next(error);
    }
};

export const pagesController = {
    sigPageEdit,
    sigPage,
    addPage,
    allPage,
    putPage,
    delPage,
    copyPage,
    changeText
}