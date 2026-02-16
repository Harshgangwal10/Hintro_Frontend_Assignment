import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  rememberMe: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.rememberMe = action.payload.rememberMe;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.rememberMe = false;
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
    restoreSession: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.rememberMe = action.payload.rememberMe;
    },
  },
});

export const { login, logout, setRememberMe, restoreSession } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectRememberMe = (state) => state.auth.rememberMe;

export default authSlice.reducer;
