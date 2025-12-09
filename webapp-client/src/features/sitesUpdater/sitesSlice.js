import { createSlice } from '@reduxjs/toolkit'

export const sitesSlice = createSlice({
  name: 'sites',
  initialState: {
    sitesToday: [],
    sitesWeek: [],
    sitesMonth: [],
    sitesAllTime: [],
    totalDays: 0,
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
    updateTotalDays: (state, action) => {
      const totalDays = action.payload.totalDaysUsing;
      console.log('total days reducer activated: ', totalDays)
      state.totalDays = totalDays;
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateSites, updateTotalDays } = sitesSlice.actions

export default sitesSlice.reducer