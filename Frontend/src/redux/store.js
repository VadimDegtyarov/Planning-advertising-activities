import { configureStore } from '@reduxjs/toolkit';
import { requestReducer } from './slices/requests';
import { authReducer } from './slices/auth';
import { usersReducer } from './slices/users';

const store = configureStore({
    reducer: {
        users: usersReducer,
        requests: requestReducer,
        auth: authReducer,

    }
});
export default store;