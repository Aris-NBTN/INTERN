import axios from 'axios';

const baseURL = "https://vapi.vnappmob.com/api/province";

const province = async () => {
    const response = await axios.get(`${baseURL}`);
    return response.data;
}

const district = async (id) => {
    const response = await axios.get(`${baseURL}/district/${id}`);
    return response.data;
}

const ward = async (id) => {
    const response = await axios.get(`${baseURL}/ward/${id}`);
    return response.data;
}

export const provinceApi = {
    province,
    district,
    ward
}
