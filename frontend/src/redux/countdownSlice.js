import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  minutes: null,
  seconds: null,
  testId: null,
  showTimer: false,
};

const countdownSlice = createSlice({
  name: 'countdown',
  initialState,
  reducers: {
    setTime: (state, action) => {
      const { minutes, seconds } = action.payload;
      state.minutes = minutes;
      state.seconds = seconds;
    },
    setMinutes: (state, action) => {
      state.minutes = action.payload;
    },
    setSeconds: (state, action) => {
      state.seconds = action.payload;
    },
    setTestId: (state, action) => {
      state.testId = action.payload;
    },
    setShowTimer: (state, action) => {
      state.showTimer = action.payload;
    },
    setCountdownToNull: (state, action) => {
      state.minutes = null;
      state.seconds = null;
      state.testId = null;
      state.showTimer = false;
    },
  },
});

export const {
  setTime,
  setMinutes,
  setSeconds,
  setTestId,
  setShowTimer,
  setCountdownToNull,
} = countdownSlice.actions;

export default countdownSlice.reducer;
