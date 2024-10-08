import { instance } from ".";

const baseURL = "/v1/order";

const get = async (body) => {
    const response = await instance.get(`${baseURL}?page=${body?.page || 1}&limit=${body?.limit || 10}`)
    return response
}

const sig = async (id) => {
    const response = await instance.get(`${baseURL}/${id}`)
    return response
}

const add = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

const del = async (id) => {
    const response = await instance.delete(`${baseURL}/${id}`)
    return response
}

const delUnPaid = async (id) => {
    const response = await instance.delete(`${baseURL}/del-unpaid`)
    return response
}

const revenue = async () => {
    const response = await instance.get(`${baseURL}/revenue`)
    return response
}

export const orderApi = {
    get,
    add,
    del,
    sig,
    revenue,
    delUnPaid
}