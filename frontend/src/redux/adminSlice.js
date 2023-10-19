import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allUsers: null,
  results: null,
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
  },
});

export const { setAllUsers, updateUser, setResults } = adminSlice.actions;

export default adminSlice.reducer;
