import userModel from '../models/userModel.js';
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';

import { createToken } from '../utils/token';
import { response } from "../utils/response";
import { verifyToken } from "../utils/protected";

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const oldUser = await userModel.findOne({ email });

        if (oldUser) {
            return response(
                res,
                StatusCodes.NOT_ACCEPTABLE,
                false,
                {},
                "Tài khoản đã tồn tại"
            );
        }

        const user = await new userModel({
            ...req.body,
            password: hashedPassword,
            slug: slugify(name),
            userType: "user",
            activeStatus: true,
        }).save();

        const token = await createToken(user);

        if (!user) {
            return response(
                res,
                StatusCodes.FORBIDDEN,
                false,
                {},
                "Could not create user due to user error"
            );
        }

        const userNew = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            userType: user.userType,
            activeStatus: user.activeStatus,
            slug: user.slug,
        }

        return response(res, StatusCodes.ACCEPTED, true, { user: userNew, token }, null);

    } catch (error) {
        next(error);
    }
}

const login = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return response(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            {},
            "Could not login, Please Provide all information"
        );
    }

    try {
        const user = await userModel.findOne({
            $or: [{ name }, { email: name }],
        });

        if (!user) {
            return response(
                res,
                StatusCodes.NOT_FOUND,
                false,
                {},
                "Tài khoản không tồn tại"
            );
        }

        const matched = await comparePassword(password, user.password);

        const userNew = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            userType: user.userType,
            activeStatus: user.activeStatus,
            slug: user.slug,
            courses: user.courses,
        }

        if (matched) {
            if (user.activeStatus) {
                const token = await createToken(user);
                if (token) {
                    return response(
                        res,
                        StatusCodes.ACCEPTED,
                        true,
                        { user: userNew, token },
                        null
                    );
                }

                return response(
                    res,
                    StatusCodes.BAD_REQUEST,
                    false,
                    {},
                    "Could not login"
                );
            } else {
                return response(
                    res,
                    StatusCodes.NOT_ACCEPTABLE,
                    false,
                    {},
                    "Tài khoản đã bị khóa"
                );
            }
        } else {
            return response(
                res,
                StatusCodes.NOT_ACCEPTABLE,
                false,
                {},
                "Mật khẩu không chính xác"
            );
        }
    } catch (error) {
        return response(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            {},
            error.message
        );
    }
};

const loginGoogle = async (req, res) => {
    const account = req.body;
    const name = account.email;
    if (!name) {
        return response(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            {},
            "Could not login, Please Provide all information"
        );
    }

    try {
        const user = await userModel.findOne({
            $or: [{ email: name }, { name }],
        });

        if (!user) {
            const user = await new userModel({
                name: name,
                email: name,
                password: "123456",
                slug: slugify(name),
                userType: "user",
                activeStatus: true,
                picture: account.picture,
            }).save();

            const token = await createToken(user);
            if (!user) {
                return response(
                    res,
                    StatusCodes.FORBIDDEN,
                    false,
                    {},
                    "Could not create user due to user error"
                );
            }

            const userNew = {
                _id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                activeStatus: user.activeStatus,
                slug: user.slug,
            }

            return response(res, StatusCodes.ACCEPTED, true, { user: userNew, token }, null);
        }

        const userNew = {
            _id: user._id,
            name: user.name,
            email: user.email,
            userType: user.userType,
            activeStatus: user.activeStatus,
            slug: user.slug,
        }

        if (user.activeStatus) {
            const token = await createToken(user);
            if (token) {
                return response(
                    res,
                    StatusCodes.ACCEPTED,
                    true,
                    { user: userNew, token },
                    null
                );
            }

            return response(
                res,
                StatusCodes.BAD_REQUEST,
                false,
                {},
                "Could not login"
            );
        } else {
            return response(
                res,
                StatusCodes.NOT_ACCEPTABLE,
                false,
                {},
                "Tài khoản đã bị khóa"
            );
        }
    } catch (error) {
        return response(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            {},
            error.message
        );
    }
};

const reAuth = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return response(res, StatusCodes.BAD_REQUEST, false, {}, "No Token Found");
    }

    try {
        const result = await verifyToken(token);

        if (result) {
            const user = await userModel.findById(result._id);

            if (!user || !user.activeStatus) {
                return response(
                    res,
                    StatusCodes.BAD_REQUEST,
                    false,
                    {},
                    "Could not authenticate"
                );
            }

            const newToken = await createToken(user);

            const userNew = {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                userType: user.userType,
                activeStatus: user.activeStatus,
                slug: user.slug,
                courses: user.courses,
            }

            if (newToken) {
                return response(
                    res,
                    StatusCodes.OK,
                    true,
                    { user: userNew, token: newToken },
                    null
                );
            }
        } else {
            return response(
                res,
                StatusCodes.BAD_REQUEST,
                false,
                {},
                "Please Login Again"
            );
        }
    } catch (error) {
        return response(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            {},
            error.message
        );
    }
};

export const authController = {
    login,
    register,
    loginGoogle,
    reAuth
}
