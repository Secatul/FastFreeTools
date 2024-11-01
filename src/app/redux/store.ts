import { configureStore } from '@reduxjs/toolkit';
import toolsReducer from '../features/toolSlice';

export const store = configureStore({
  reducer: {
    tools: toolsReducer,
  },
});

// Define os tipos RootState e AppDispatch para usar em hooks e seletores
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
