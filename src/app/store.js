import { configureStore } from '@reduxjs/toolkit';
import busReducer from '../features/users/busSlice';

export const store = configureStore({
  reducer: {
    bus: busReducer,
  },
});