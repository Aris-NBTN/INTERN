import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from '../utils/apiError.js';

const login = async (req, res, next) => {
    const correctCondition = Joi.object({
        name: Joi.string().required().min(3).trim().strict().messages({
            "any.required": "Tên bắt buộc phải có",
            "string.empty": "Tên không được bỏ trống",
            "string.min": "Tên phải có ít nhất {#limit} ký tự",
            "string.trim": "Tên không hợp lệ (Không khoảng cách)",
        }),
        password: Joi.string().required().trim().min(5).strict().messages({
            "any.required": "Mật khẩu bắt buộc phải có",
            "string.empty": "Mật khẩu không được bỏ trống",
            "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
            "string.trim": "Mật khẩu không hợp lệ (Không khoảng cách)",
        }),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
}

const register = async (req, res, next) => {
    const correctCondition = Joi.object({
        name: Joi.string().required().min(3).trim().strict().messages({
            "any.required": "Tên bắt buộc phải có",
            "string.empty": "Tên không được bỏ trống",
            "string.min": "Tên phải có ít nhất {#limit} ký tự",
            "string.trim": "Tên không hợp lệ (Không khoảng cách)",
        }),
        email: Joi.string().email().required().trim().strict().messages({
            "any.required": "Email bắt buộc phải có",
            "string.empty": "Email không được bỏ trống",
            "string.email": "Email không hợp lệ",
            "string.trim": "Email không hợp lệ (Không khoảng cách)",
        }),
        password: Joi.string().required().trim().min(5).strict().messages({
            "any.required": "Mật khẩu bắt buộc phải có",
            "string.empty": "Mật khẩu không được bỏ trống",
            "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
            "string.trim": "Mật khẩu không hợp lệ (Không khoảng cách)",
        }),
        phone: Joi.string().required().trim().min(5).strict().messages({
            "any.required": "Số điện thoại bắt buộc phải có",
            "string.empty": "Số điện thoại không được bỏ trống",
            "string.min": "Số điện thoại phải có ít nhất {#limit} ký tự",
            "string.trim": "Số điện thoại không hợp lệ (Không khoảng cách)",
        }),
        gender: Joi.string().required().min(3).trim().strict().messages({
            "any.required": "Giới tính bắt buộc phải có",
            "string.empty": "Giới tính không được bỏ trống",
            "string.min": "Giới tính phải có ít nhất {#limit} ký tự",
            "string.trim": "Giới tính không hợp lệ (Không khoảng cách)",
        }),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
}

export const authValidation = {
    login,
    register
}