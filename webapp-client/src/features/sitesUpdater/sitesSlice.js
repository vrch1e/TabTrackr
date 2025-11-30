import { createSlice } from '@reduxjs/toolkit'

export const sitesSlice = createSlice({
  name: 'sites',
  initialState: {
    sites: [],
  },
  reducers: {
    updateSites: (state, action) => {
      state.sites = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateSites } = sitesSlice.actions

export default sitesSlice.reducer