import { instance } from ".";

const baseURL = "/v1/user";

const get = async () => {
    const response = await instance.get(`${baseURL}`)
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

export const userApi = {
    get,
    del,
    put
}