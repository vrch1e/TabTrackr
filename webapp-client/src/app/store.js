import { configureStore } from '@reduxjs/toolkit'
import tokenReducer from '../features/tokenUpdater/counterSlice'

export default configureStore({
  reducer: {auth: tokenReducer},
})