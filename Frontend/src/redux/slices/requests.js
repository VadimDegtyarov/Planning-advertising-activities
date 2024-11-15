import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchRequests = createAsyncThunk('request/fetchrequest', async () => {
    const { data } = await axios.get('/requests');
    return data;
});


export const fetchRemoveRequest = createAsyncThunk('requests/fetchRemoveRequest', async (id) =>
    axios.delete(`/requests/${id}`),
);

const initialState = {
    requests: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    },
};

const requestSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchRequests.pending]: (state) => {
            state.requests.items = [];
            state.requests.status = 'loading';
        },
        [fetchRequests.fulfilled]: (state, action) => {
            state.requests.items = action.payload;
            state.requests.status = 'loaded';
        },
        [fetchRequests.rejected]: (state) => {
            state.requests.items = [];
            state.requests.status = 'error';
        },
       
        [fetchRemoveRequest.fulfilled]: (state, action) => {
            state.requests.items = state.requests.items.filter(obj => obj._id !== action.meta.arg);
        },
    },
});

export const requestReducer = requestSlice.reducer;
