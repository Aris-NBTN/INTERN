import { genericSlice, genericThunk } from '~/redux/utils';
// import { folderMangerApi } from '~/apis/fileMangerApi';
import { fileMangerApi } from '~/apis/fileMangerApi';

const name = 'file'

export const getFileInFoldersApi = genericThunk(`${name}/get`, fileMangerApi.filesInFolder);
// export const addCourseApi = genericThunk(`${name}/add`, courseApi.add);
// export const delCourseApi = genericThunk(`${name}/del`, courseApi.del);
// export const putCourseApi = genericThunk(`${name}/put`, courseApi.put);
// export const putOrderCourseApi = genericThunk(`${name}/put-order`, courseApi.putOrder);

const fileSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getFileInFoldersApi],
    // addApi: [addCourseApi],
    // delApi: [delCourseApi],
    // putApi: [putCourseApi]
});

export default fileSlice.reducer;