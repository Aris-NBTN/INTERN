import { instance } from ".";

const baseURL = "/v1/user";

const get = async (body) => {
    const response = await instance.get(`${baseURL}?page=${body?.page || 1}&limit=${body?.limit || 10}`)
    return response
}

const del = async (id) => {
    const response = await instance.delete(`${baseURL}/${id}`)
    return response
}

const put = async (body) => {
    const response = await instance.put(`${baseURL}/${body.id}`, body)
    return response
}

const putUser = async (body) => {
    const response = await instance.put(`${baseURL}/user/${body.id}`, body)
    return response
}

const putUserNotify = async (body) => {
    const response = await instance.put(`${baseURL}/notify/${body.id}`, body)
    return response
}

const putUserForgot = async (body) => {
    const response = await instance.put(`${baseURL}/user/forgot-password`, body)
    return response
}

const putVideo = async (body) => {
    const response = await instance.put(`${baseURL}/video/${body.id}`, body)
    return response
}

const checkEmail = async (body) => {
    const response = await instance.post(`${baseURL}/check-email`, body)
    return response
}

const checkCode = async (body) => {
    const response = await instance.post(`${baseURL}/check-code`, body)
    return response
}

export const userApi = {
    get,
    del,
    put,
    putUser,
    putUserNotify,
    putUserForgot,
    putVideo,
    checkEmail,
    checkCode,
}