import { genericSlice, genericThunk } from '~/redux/utils';
import { pluginsApi } from '~/apis/pluginsApi';

const name = 'plugins'

export const getPluginsApi = genericThunk(`${name}/get`, pluginsApi.get);
export const addPluginsApi = genericThunk(`${name}/add`, pluginsApi.add);

const categoryCoursesSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: getPluginsApi,
    addApi: addPluginsApi,
});

export default categoryCoursesSlice.reducer;


