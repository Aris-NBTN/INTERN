import { instance } from ".";

const baseURL = "/v1/info";

const allInfo = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const updateInfo = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

export const infoApi = {
    allInfo,
    updateInfo,
}