// authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { TokenManager } from '../components/getToken.js';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export const login = (values, navigate) => async (dispatch) => {
const user = TokenManager.getToken();
  try {
    dispatch(loginStart());
    const response = await axios.post('https://dev-api.getklippie.com/v1/auth/login', {
      email: values.email,
      password: values.password,
      is_social: false,
      firebase_id: 'string',
      id_token: 'string',
      device_id: 'string',
    });

    if (response && response.data) {
      const encodedUser = btoa(JSON.stringify(response.data));
      dispatch(loginSuccess(response.data));
      // Other actions you might want to dispatch, e.g., storing tokens or navigating to a new page
      TokenManager.setToken('userToken', 2160, encodedUser);
      navigate('/dashboard');
    } else {
      dispatch(loginFailure('Invalid response from the server.'));
    }
  } catch (error) {
    if (error.response.data.detail) {
      dispatch(loginFailure(error.response.data.detail));
    } else {
      // You might want to navigate to OTP verification or handle other cases
      dispatch(loginFailure(error.response.data.message));
      // navigate('/otpVarification');
    }
  }
};

export default authSlice.reducer;
