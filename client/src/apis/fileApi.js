import axios from "axios";
import { baseURL } from "~/utils";

const uploadFile = async (body) => {
    const response = await axios.post(`${baseURL}/v1/file`, body)
    return response.data
}

const fileBase64 = async (body) => {
    const response = await axios.post(`${baseURL}/v1/file/base64`, body)
    return response.data
}

const file3D = async (body) => {
    const response = await axios.post(`${baseURL}/v1/file/3d`, body)
    return response.data
}

const video = async (body) => {
    const response = await axios.post(`${baseURL}/v1/file/video`, body)
    return response.data
}

export const fileApi = {
    uploadFile,
    fileBase64,
    file3D,
    video
}