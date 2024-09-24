// src/features/menu/menuSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fileMangerApi } from '~/apis/fileMangerApi';

export const fetchfileManger = createAsyncThunk("fileManger/fetch", async (body, thunkAPI) => {
    try {
        const data = await fileMangerApi.allFileImage(body);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

const fileMangerSlice = createSlice({
    name: 'fileMangers',
    initialState: {
        fileManger: [],
        loading: true,
        error: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchfileManger.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchfileManger.fulfilled, (state, action) => {
                state.loading = false;
                state.fileManger = action.payload;
            })
            .addCase(fetchfileManger.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default fileMangerSlice.reducer;
