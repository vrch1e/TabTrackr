import { configureStore } from '@reduxjs/toolkit'
import siteReducer from '../features/sitesUpdater/sitesSlice'

export default configureStore({
  reducer: {sites: siteReducer},
})