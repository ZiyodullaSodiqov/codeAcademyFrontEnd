import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import problemsReducer from './problemsSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    problems: problemsReducer,
  }
});
