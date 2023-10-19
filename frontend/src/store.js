import { configureStore } from '@reduxjs/toolkit';
import userReducer from './redux/userSlice';
import adminReducer from './redux/adminSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
  },
});
