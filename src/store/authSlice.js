import { createSlice } from '@reduxjs/toolkit';

// Helper function to safely get and parse localStorage items
const safeGetLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Failed to parse localStorage item '${key}':`, error);
    localStorage.removeItem(key); // Clear invalid data
    return null;
  }
};

// Load initial state safely
const loadInitialState = () => {
  const token = localStorage.getItem('token'); // Keep token as raw string
  const user = safeGetLocalStorage('user');
  
  return {
    isAuthenticated: !!token,
    user,
    token,
    loading: false,
    error: null,
  };
};

const initialState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      
      // Persist to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Thunk action for login
export const loginUser = (username, password) => async (dispatch) => {
  dispatch(loginStart());
  
  try {
    const response = await fetch('http://127.0.0.1:5055/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    // if (!data.token || !data.user) {
    //   throw new Error('Invalid server response - missing token or user data');
    // }
    
    dispatch(loginSuccess({
      user: data.user,
      token: data.token,
    }));
    
    return { success: true };
  } catch (error) {
    dispatch(loginFailure(error.message));
    return { success: false, error: error.message };
  }
};

// Thunk action to check authentication status
export const checkAuth = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  dispatch(loginStart());
  
  try {
    const response = await fetch('http://127.0.0.1:5055/api/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Authentication check failed');
    }
    
    dispatch(loginSuccess({
      user: data,
      token: token,
    }));
  } catch (error) {
    dispatch(logout());
    dispatch(loginFailure(error.message));
  }
};

export default authSlice.reducer;