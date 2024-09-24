import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';
import userSchema from '~/models/userModel.js';
import { hashPassword } from '~/helpers/authHelper.js';
import { addData, updateData, deleteData, getData, getSigData } from "./indexControllder";

const nameMess = 'Người dùng';

const singleUser = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const results = await getSigData(nameMess, { slug: slug }, userSchema);
        res.status(results.status).json(results.message);
    } catch (error) {
        next(error);
    }
}

const addUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        await userSchema.findOne({ email }) && res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email đã tồn tại' });
        const addUser = await new userSchema({ ...req.body, password: hashedPassword, slug: slugify(name) }).save();
        res.status(StatusCodes.CREATED).json(addUser);
    } catch (error) {
        next(error);
    }
}

const allUser = async (req, res, next) => {
    try {
        const results = await getData(nameMess, userSchema, {
            sort: { createdAt: -1 },
        });
        res.status(results.status).json(results.message);
    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteData(nameMess, userSchema, id);
        res.status(result.status).json({ message: result.message, _id: id });
    } catch (error) {
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await updateData(nameMess, userSchema, id, req.body);
        if (result.data) result.data.password = undefined;
        res.status(result.status).json({ message: result.message, newData: result.data });
    } catch (error) {
        next(error);
    }
}

const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userSchema.findById(id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        const newCourses = req.body.courses || [];
        const updatedCourses = [
            ...user.courses,
            ...newCourses.filter(courseId => !user.courses.some(existingCourseId => existingCourseId.equals(courseId)))
        ];
        const updatedData = {
            ...req.body,
            courses: updatedCourses
        };
        const newData = await userSchema.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(StatusCodes.OK).json(newData);
    } catch (error) {
        next(error);
    }
};


export const userController = {
    addUser,
    allUser,
    singleUser,
    deleteUser,
    updateUser,
    updateCourse
}






