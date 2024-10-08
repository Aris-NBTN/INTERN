import { instance } from ".";

const baseURL = "/v1/data";

const backup = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const restore = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

const dowBackupFile = async (body) => {
    const response = await instance.post(`${baseURL}/dow-file`, body)
    return response
}

const dowBackupData = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

export const dataApi = {
    backup,
    restore,
    dowBackupFile,
    dowBackupData
}