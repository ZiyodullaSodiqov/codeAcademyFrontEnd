import authService from './authService';
import { loginSuccess, logout, setLoading, setError } from '../store/authSlice';

export const loginUser = (username, password) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const loginData = await authService.login(username, password);
    const userData = await authService.getMe();
    
    dispatch(loginSuccess({
      user: userData,
      token: loginData.token,
    }));
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Login failed';
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch) => {
  authService.logout();
  dispatch(logout());
};

export const checkAuth = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const token = localStorage.getItem('token');
    
    if (token) {
      const userData = await authService.getMe();
      dispatch(loginSuccess({
        user: userData,
        token,
      }));
    }
  } catch (error) {
    authService.logout();
    dispatch(logout());
  } finally {
    dispatch(setLoading(false));
  }
};