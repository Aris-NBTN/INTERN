import { instance } from ".";

const baseURL = '/v1/plugins'

const get = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const add = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

export const pluginsApi = {
    get,
    add,
}