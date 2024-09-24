import { genericSlice, genericThunk } from '~/redux/utils';
import { orderApi } from '~/apis/orderApi';

const name = 'order';

export const getOrderApi = genericThunk(`${name}/get`, orderApi.get);

const roleSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: getOrderApi,
});

export default roleSlice.reducer;

