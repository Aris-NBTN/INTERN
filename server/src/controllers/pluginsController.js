import { StatusCodes } from "http-status-codes";
import slugify from "slugify";

import pluginsModel from "~/models/pluginsModel";
import jsPluginsModel from "~/models/jsPluginsModel";
import cssPluginsModel from "~/models/cssPluginsModel";
import path from 'path';

const addFileEV = async (req, res, next) => {
    try {
        const files = req.files;
        const promises = files.map(async (file) => {
            const extension = path.extname(file.originalname).toLowerCase();

            if (extension === '.css') {
                await cssPluginsModel.create({ link: `/plugins/ev/${file.filename}` });
            } else if (extension === '.js') {
                await jsPluginsModel.create({ link: `/plugins/ev/${file.filename}` });
            } else {
                throw new Error(`Unsupported file type: ${extension}`);
            }
        });
        await Promise.all(promises);
        res.status(StatusCodes.CREATED).json({ message: 'Files uploaded successfully' });
    } catch (error) {
        next(error);
    }
};

const addFilePlugins = async (req, res, next) => {
    try {
        const data = { ...req.body, src: `/plugins/${req.file.filename}` };
        const newData = await new pluginsModel(data).save();
        res.status(200).json({ message: "Đã thêm plugins", newData: newData });
    } catch (error) {
        next(error);
    }
};

const all = async (req, res, next) => {
    try {
        const allData = await pluginsModel.find({}).sort({ createdAt: -1 });
        res.status(StatusCodes.CREATED).json(allData);
    } catch (error) {
        next(error);
    }
}

const del = async (req, res, next) => {
    try {
        const { id } = req.params;
        await pluginsModel.findByIdAndDelete(id)
        res.status(StatusCodes.OK).json({ message: 'Đã xóa danh mục!' });
    } catch (error) {
        next(error);
    }
}

export const pluginsController = {
    addFileEV,
    addFilePlugins,
    all,
    del,
}