import { configureStore } from '@reduxjs/toolkit';
import toolsReducer from './app/features/toolsSlice';

export const store = configureStore({
  reducer: {
    tools: toolsReducer,
  },
});
