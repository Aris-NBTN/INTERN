import { genericSlice, genericThunk } from '~/redux/utils';
import { pagesApi } from '~/apis/pagesApi';

const name = 'pages'

export const getPageApi = genericThunk(`${name}/get`, pagesApi.get);
export const addPageApi = genericThunk(`${name}/add`, pagesApi.add);
export const delPageApi = genericThunk(`${name}/del`, pagesApi.del);
export const putPageApi = genericThunk(`${name}/put`, pagesApi.put);
export const copyPageApi = genericThunk(`${name}/copy`, pagesApi.copy);

const roleSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: getPageApi,
    addApi: addPageApi,
    delApi: delPageApi,
    putApi: putPageApi,
    copyApi: copyPageApi
});

export default roleSlice.reducer;
