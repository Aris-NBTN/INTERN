import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toastError, toastLoading, toastSuccess } from '~/components/toast';

export const genericSlice = ({
    name,
    initialState,
    getApi,
    addApi,
    delApi,
    putApi,
    copyApi,
    reducers,
}) => {
    return createSlice({
        name,
        initialState,
        reducers: {
            ...reducers,
        },
        extraReducers: (builder) => {
            getApi && builder
                .addCase(getApi.pending, (state) => { state.loading = true; })
                .addCase(getApi.fulfilled, (state, action) => {
                    state[name] = action.payload;
                    state.loading = false;
                    state.error = false;
                })
                .addCase(getApi.rejected, (state, action) => {
                    state[name] = action.payload;
                    state.loading = false;
                    state.error = true;
                });

            addApi && builder
                .addCase(addApi.pending, (state) => { state.loading = true; })
                .addCase(addApi.fulfilled, (state, action) => {
                    state[name].unshift(action.payload.newData);
                    state.loading = false;
                    state.error = false;
                })
                .addCase(addApi.rejected, (state) => {
                    state.loading = false;
                    state.error = true;
                });

            copyApi && builder
                .addCase(copyApi.pending, (state) => { state.loading = true; })
                .addCase(copyApi.fulfilled, (state, action) => {
                    state[name].unshift(action.payload.newData);
                    state.loading = false;
                    state.error = false;
                })
                .addCase(copyApi.rejected, (state) => {
                    state.loading = false;
                    state.error = true;
                });

            delApi && builder
                .addCase(delApi.pending, (state) => { state.loading = true; })
                .addCase(delApi.fulfilled, (state, action) => {
                    state[name] = state[name].filter(data => data._id !== action.payload._id);
                    state.loading = false;
                    state.error = false;
                })
                .addCase(delApi.rejected, (state) => {
                    state.loading = false;
                    state.error = true;
                });

            putApi && builder
                .addCase(putApi.pending, (state) => { state.loading = true; })
                .addCase(putApi.fulfilled, (state, action) => {
                    state.loading = false;
                    state.error = false;
                    const index = state[name].findIndex(data => data._id === action.payload.newData._id);
                    if (index !== -1) {
                        state[name][index] = action.payload.newData;
                    }
                })
                .addCase(putApi.rejected, (state) => {
                    state.loading = false;
                    state.error = true;
                });
        },
    });
};

export const genericThunk = (key, api) => createAsyncThunk(key, async (body, thunkAPI) => {
    try {
        const data = await api(body);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

export const genericDispatch = (dispatch, apiCall, onSuccess, onError) => {
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    toastLoading(time, 'Đang cập nhập...');
    return dispatch(apiCall)
        .then((result) => {
            if (result.error) {
                toastError(time, 'Cập nhập thất bại!', result.payload);
                if (onError) onError(result);
            } else {
                toastSuccess(time, 'Cập nhập thành công!', result.payload.message);
                if (onSuccess) onSuccess(result);
            }
            return result;
        })
};
