import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

// Асинхронные действия
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const { data } = await axios.get('/users');
    return data;
});

export const fetchUserMe = createAsyncThunk('users/fetchUserMe', async () => {
    const { data } = await axios.get('/auth/me');
    return data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
    await axios.delete(`/users/${id}`);  
    return id;
});

export const fetchUpdateUser = createAsyncThunk('users/fetchUpdateUser', async ({ id, data }) => {
    const response = await axios.patch(`/users/${id}`, data);
    return response.data;
});

export const fetchUser = createAsyncThunk('users/fetchUser', async (id) => {
    const { data } = await axios.get(`/auth/${id}`);
    return data;
});

// Срез (slice) состояния пользователей
const usersSlice = createSlice({
    name: 'users',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchUsers
            .addCase(fetchUsers.pending, (state) => {
                state.items = [];
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchUsers.rejected, (state) => {
                state.items = [];
                state.status = 'error';
            })
            // deleteUser
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.items = state.items.filter(user => user._id !== action.payload);
            })
            // fetchUserMe
            .addCase(fetchUserMe.pending, (state) => {
                state.items = [];
                state.status = 'loading';
            })
            .addCase(fetchUserMe.fulfilled, (state, action) => {
                state.items = [action.payload];
                state.status = 'loaded';
            })
            .addCase(fetchUserMe.rejected, (state) => {
                state.items = [];
                state.status = 'error';
            })
            // fetchUser
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                const index = state.items.findIndex(user => user._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
                state.status = 'loaded';
            })
            .addCase(fetchUser.rejected, (state) => {
                state.status = 'error';
            })
            // fetchUpdateUser
            .addCase(fetchUpdateUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUpdateUser.fulfilled, (state, action) => {
                const index = state.items.findIndex(user => user._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.status = 'loaded';
            })
            .addCase(fetchUpdateUser.rejected, (state) => {
                state.status = 'error';
            });
    }
});

export const usersReducer = usersSlice.reducer;
