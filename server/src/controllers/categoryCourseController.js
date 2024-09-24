import categoryCourseSchema from "~/models/categoryCourseModel.js";
import { addData, updateData, deleteData, getData } from "./indexControllder";

const nameMess = 'Danh mục khóa học';

const allCategory = async (req, res, next) => {
    try {
        const results = await getData(nameMess, categoryCourseSchema, { sort: { createdAt: -1 } });
        res.status(results.status).json(results.message);
    } catch (error) {
        next(error);
    }
}

const addCategory = async (req, res, next) => {
    try {
        const result = await addData(nameMess, categoryCourseSchema, req.body, { uniqueField: 'category', customSlugField: 'category' });
        res.status(result.status).json({ message: result.message, newData: result.data });
    } catch (error) {
        next(error);
    }
}

const delCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteData(nameMess, categoryCourseSchema, id);
        res.status(result.status).json({ message: result.message, _id: id });
    } catch (error) {
        next(error);
    }
}

const putCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await updateData(nameMess, categoryCourseSchema, id, req.body, { uniqueField: 'category' });
        res.status(result.status).json({ message: result.message, newData: result.data });
    } catch (error) {
        next(error);
    }
}

export const categoryCourserController = {
    addCategory,
    allCategory,
    putCategory,
    delCategory,
}