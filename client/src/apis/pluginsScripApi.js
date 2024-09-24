import { instance } from ".";

const baseURL = "/v1/plugins-script";

const get = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const add = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

const put = async (body) => {
    const response = await instance.put(`${baseURL}/${body.id}`, body)
    return response
}

const del = async (id) => {
    const response = await instance.delete(`${baseURL}/${id}`)
    return response
}

export const pluginScriptApi = {
    get,
    add,
    put,
    del
}