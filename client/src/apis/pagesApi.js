import { instance } from ".";
const baseURL = '/v1/pages'

const get = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const add = async (data) => {
    const response = await instance.post(`${baseURL}`, data)
    return response
}

const del = async (id) => {
    baseURL
    const response = await instance.delete(`${baseURL}/${id}`)
    return response
}

const put = async (body) => {
    const response = await instance.put(`${baseURL}/${body.id}`, body)
    return response
}

const copy = async (id) => {
    const response = await instance.post(`${baseURL}/${id}`)
    return response
}

const sig = async (slug) => {
    const response = await instance.get(`${baseURL}/slug/${slug}`)
    return response
}

const sigEdit = async (slug) => {
    const response = await instance.get(`${baseURL}/page-edit/${slug}`)
    return response
}

export const pagesApi = {
    get,
    add,
    del,
    sig,
    put,
    copy,
    sigEdit
}