import { instance } from ".";

const baseURL = "/v1/file-manager";

const allFile = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const allFileImage = async () => {
    const response = await instance.get(`${baseURL}/images`)
    return response
}

const filterFile = async (body) => {
    const response = await instance.post(`${baseURL}/filter`, body)
    return response
}

const filesInFolder = async (body) => {
    const response = await instance.post(`${baseURL}/files-in-folder`, body)
    return response
}

const createFolder = async (body) => {
    const response = await instance.post(`${baseURL}/folder`, body)
    return response
}

const updateFolder = async (body) => {
    const response = await instance.put(`${baseURL}/folder`, body)
    return response
}

const deleteFolder = async (body) => {
    const response = await instance.delete(`${baseURL}/folder`, body)
    return response
}

export const fileMangerApi = {
    allFile,
    allFileImage,
    filterFile,
    filesInFolder
}

export const folderMangerApi = {
    createFolder,
    deleteFolder,
    updateFolder
}