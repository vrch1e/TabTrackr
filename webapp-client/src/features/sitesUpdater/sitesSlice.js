import { createSlice } from '@reduxjs/toolkit'

export const sitesSlice = createSlice({
  name: 'sites',
  initialState: {
    sitesToday: [],
    sitesWeek: [],
    sitesMonth: [],
    sitesAllTime: [],
  },
  reducers: {
    updateSites: (state, action) => {
      const { sitesToday, sitesWeek, sitesMonth, sitesAllTime } = action.payload;
      console.log('sitesToday in redux: ', sitesToday);
      state.sitesToday = sitesToday;
      state.sitesWeek = sitesWeek;
      state.sitesMonth = sitesMonth;
      state.sitesAllTime = sitesAllTime;
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateSites } = sitesSlice.actions

export default sitesSlice.reducer