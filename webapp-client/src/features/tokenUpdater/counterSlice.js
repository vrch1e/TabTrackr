import { createSlice } from '@reduxjs/toolkit'

export const tokenSlice = createSlice({
  name: 'auth',
  initialState: {
    token: 'empty',
  },
  reducers: {
    updateToken: (state, action) => {
      state.token = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateToken } = tokenSlice.actions

export default tokenSlice.reducer