import roleSchema from '~/models/roleModel';
import { addData, updateData, deleteData, getData } from "./indexControllder";

const nameMess = 'Quyền';

const addRole = async (req, res, next) => {
    try {
        const result = await addData(nameMess, roleSchema, req.body, { uniqueField: 'nameRole' });
        res.status(result.status).json({ message: result.message, newData: result.data });
    } catch (error) {
        next(error);
    }
}

const allRole = async (req, res, next) => {
    try {
        const results = await getData(nameMess, roleSchema, {
            sort: { createdAt: -1 },
        });
        res.status(results.status).json(results.message);
    } catch (error) {
        next(error);
    }
}

const delRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteData(nameMess, roleSchema, id);
        res.status(result.status).json({ message: result.message, _id: id });
    } catch (error) {
        next(error);
    }
}

const putRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await updateData(nameMess, roleSchema, id, req.body, { uniqueField: 'nameRole' });
        res.status(result.status).json({ message: result.message, newData: result.data });
    } catch (error) {
        next(error);
    }
}

export const roleController = {
    addRole,
    allRole,
    delRole,
    putRole
}






