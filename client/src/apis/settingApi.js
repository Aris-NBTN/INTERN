import { instance } from ".";

const baseURL = "/v1/setting";

const put = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

export const dataSettingApi = {
    put
}