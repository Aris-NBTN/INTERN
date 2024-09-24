import { instance } from ".";

const baseURL = "/v1/courser";

const all = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const get = async () => {
    const response = await instance.get(`${baseURL}/courser-admin`)
    return response
}

const sig = async (slug) => {
    const response = await instance.get(`${baseURL}/slug/${slug}`)
    return response
}

const add = async (body) => {
    const response = await instance.post(`${baseURL}/courser-admin`, body)
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

const cart = async (body) => {
    const response = await instance.post(`${baseURL}/cart`, body)
    return response
}

const outstand = async (body) => {
    const response = await instance.get(`${baseURL}/outstand`, body)
    return response
}

const search = async (body) => {
    const response = await instance.get(`${baseURL}/search?category-course=${body.categoryCourse || ''}&price-course=${body.priceCourse || ''}`, body)
    return response
}

export const courseApi = {
    all,
    get,
    sig,
    add,
    put,
    del,
    cart,
    outstand,
    search
}