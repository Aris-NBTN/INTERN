// src/features/menu/menuSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { layoutApi } from '~/apis/layoutApi';
export const fetchMenu = createAsyncThunk("menu/fetchMenu", async (body, thunkAPI) => {
    try {
        const data = await layoutApi.getLayout(body);
        return data[0];
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        menuItems: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        // Các reducers khác nếu cần
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenu.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMenu.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.menuItems = action.payload;
            })
            .addCase(fetchMenu.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default menuSlice.reducer;
