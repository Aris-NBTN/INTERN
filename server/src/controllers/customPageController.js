import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import masonrySchema from "~/models/masonryModel.js";
import { slugifyOptions } from "~/config/slugify";
import { addData, updateData, deleteData, getData, getSigData } from "./indexControllder";

const nameMess = 'Masonry';

const sigMasonry = async (req, res, next) => {
    try {
        const { slug } = req.params;
        // const allCourser = await getSigData(nameMess, slug, masonrySchema, { select: '_id name img' });
        // res.status(StatusCodes.OK).json(allCourser);
        const results = await getSigData(nameMess, { slug: slug }, masonrySchema, { select: '_id name img' });
        res.status(results.status).json(results.message);
    } catch (error) {
        next(error);
    }
}

const addMasonry = async (req, res, next) => {
    try {
        const result = await addData(nameMess, masonrySchema, req.body, { uniqueField: 'name', customSlugField: 'name' });
        res.status(result.status).json(result.data);
    } catch (error) {
        next(error);
    }
}

const putMasonry = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const { name, ...rest } = req.body;

        const currentCourse = await masonrySchema.findOne({ slug: slug });
        if (!currentCourse) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Trang không tồn tại' });
        }

        if (name && name !== currentCourse.name) {
            const existingCourse = await masonrySchema.findOne({ name });
            if (existingCourse) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Tên trang đã tồn tại' });
            }
        }

        const updateData = { ...rest };
        if (name) {
            const slug = slugify(name, slugifyOptions);
            updateData.name = name;
            updateData.slug = slug;
        }

        const newdata = await masonrySchema.findOneAndUpdate({ slug: slug }, updateData, { new: true });
        res.status(StatusCodes.OK).json({ message: 'Cập nhập Trang thành công!', newData: newdata });
    } catch (error) {
        next(error);
    }
}

const delMasonry = async (req, res, next) => {
    try {
        const { slug } = req.params;
        await masonrySchema.findOneAndDelete({ slug: slug });
        res.status(StatusCodes.OK).json({ message: 'Đã xóa trang thành công!' });
    } catch (error) {
        next(error);
    }
}

export const maronryController = {
    sigMasonry,
    addMasonry,
    putMasonry,
    delMasonry,
}