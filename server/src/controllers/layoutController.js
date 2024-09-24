import { StatusCodes } from 'http-status-codes';
import layoutSchema from '../models/layoutModel';
import { addData, updateData, deleteData, getData, getSigData } from "./indexControllder";

const nameMess = 'Bố cục';

const addLayout = async (req, res, next) => {
    try {
        const newData = await new layoutSchema({ ...req.body }).save();
        res.status(StatusCodes.CREATED).json(newData);
    } catch (error) {
        next(error);
    }
}

const getLayout = async (req, res, next) => {
    try {
        const results = await getData(nameMess, layoutSchema, {
            sort: { createdAt: -1 },
            select: '_id header footer css'
        });
        res.status(results.status).json(results.message);
    } catch (error) {
        next(error);
    }
}

const getEdit = async (req, res, next) => {
    try {
        const results = await getData(nameMess, layoutSchema, {
            sort: { createdAt: -1 },
            select: '_id edit'
        });
        res.status(results.status).json(results.message);
    } catch (error) {
        next(error);
    }
}

const updateLayout = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { ...rest } = req.body;

        const newData = await layoutSchema.findByIdAndUpdate(id, rest, { new: true });
        res.status(StatusCodes.OK).json({ message: 'Cập nhật thành công!', data: newData });
    } catch (error) {
        next(error);
    }
}

export const layoutController = {
    getLayout,
    addLayout,
    getEdit,
    updateLayout
}
