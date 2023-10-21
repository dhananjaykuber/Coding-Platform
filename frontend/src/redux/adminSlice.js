import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allUsers: null,
  results: null,
  tests: [],
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    updateUser: (state, action) => {
      const { id, submitted } = action.payload;

      const userToUpdate = state.allUsers.find((user) => user._id === id);

      if (userToUpdate) {
        userToUpdate.submitted = submitted;
      }
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setTests: (state, action) => {
      state.tests = action.payload;
    },
    addTest: (state, action) => {
      state.tests.push(action.payload);
    },
    updateTestStatus: (state, action) => {
      const { id, isLive } = action.payload;

      const testToUpdate = state.tests.find((test) => test._id === id);

      if (testToUpdate) {
        testToUpdate.isLive = isLive;
      }
    },
  },
});

export const {
  setAllUsers,
  updateUser,
  setResults,
  addTest,
  setTests,
  updateTestStatus,
} = adminSlice.actions;

export default adminSlice.reducer;
