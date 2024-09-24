import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import { slugifyOptions } from "~/config/slugify";

export const addData = async (nameMess, schema, data, options = {}) => {
    try {
        const { name } = data;
        const { uniqueField, customSlugField } = options;
        const existingData = await schema.findOne({ [uniqueField]: data[uniqueField] });

        if (existingData) {
            return { status: StatusCodes.BAD_REQUEST, message: `${nameMess} đã tồn tại!` };
        }

        if (customSlugField) {
            const slugSource = customSlugField ? data[customSlugField] : name;
            data.slug = slugify(slugSource, slugifyOptions);
            data.path = data.slug;
        }

        const newData = await new schema(data).save();
        return {
            status: StatusCodes.CREATED,
            message: `Đã thêm ${nameMess} thành công!`,
            data: newData
        };
    } catch (error) {
        throw error;
    }
};

export const updateData = async (nameMess, schema, id, data, options = {}, checkData = true) => {
    try {
        const { ...rest } = data;
        const { uniqueField } = options;
        const name = data[uniqueField];

        if (checkData) {
            const currentData = await schema.findById(id);
            if (!currentData) {
                return { status: StatusCodes.NOT_FOUND, message: `${nameMess} không tồn tại` };
            }

            if (name && name !== currentData[uniqueField]) {
                const existingData = await schema.findOne({ [uniqueField]: name });
                if (existingData) {
                    return { status: StatusCodes.BAD_REQUEST, message: `Tên ${nameMess} đã tồn tại` };
                }
            }
        }

        const updateData = { ...rest };
        if (name) {
            updateData.name = name;
            updateData.slug = slugify(name, slugifyOptions);
        }

        const newData = await schema.findByIdAndUpdate(id, updateData, { new: true });
        return {
            status: StatusCodes.OK,
            message: `Cập nhập ${nameMess} thành công!`,
            data: newData
        };
    } catch (error) {
        throw error;
    }

}

export const deleteData = async (nameMess, schema, id) => {
    try {
        const currentData = await schema.findById(id);

        if (!currentData) {
            return { status: StatusCodes.NOT_FOUND, message: `${nameMess} không tồn tại` };
        }

        await schema.findByIdAndDelete(id);
        return { status: StatusCodes.OK, message: `Xóa ${nameMess} thành công!` };
    } catch (error) {
        throw error;
    }
}

export const getData = async (nameMess, schema, options) => {
    try {
        const { populate = null, select = null, sort = null } = options;
        let query = schema.find();

        if (populate) query = query.populate(populate);
        if (select) query = query.select(select);
        if (sort) query = query.sort(sort);

        const allData = await query.exec();
        if (!allData) {
            return { status: StatusCodes.NOT_FOUND, message: { message: `Không tìm thấy dữ liệu ${nameMess}` } };
        }
        return { status: StatusCodes.OK, message: allData };
    } catch (error) {
        throw error;
    }
}

export const getSigData = async (nameMess, nameFind, schema, options = {}) => {
    try {
        const { populate = null, select = null, sort = null } = options;
        let query = schema.findOne(nameFind);
        if (populate) query = query.populate(populate);
        if (select) query = query.select(select);
        if (sort) query = query.sort(sort);

        const allData = await query.exec();
        if (!allData) {
            return { status: StatusCodes.NOT_FOUND, message: { message: `Không tìm thấy dữ liệu ${nameMess}` } };
        }
        return { status: StatusCodes.OK, message: allData };
    } catch (error) {
        throw error;
    }
}