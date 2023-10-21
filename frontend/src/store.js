import { configureStore } from '@reduxjs/toolkit';
import userReducer from './redux/userSlice';
import adminReducer from './redux/adminSlice';
import countdownReducer from './redux/countdownSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    countdown: countdownReducer,
  },
});
