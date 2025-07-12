import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  fetchLandLoardApi,
  fetchManagersApi,
  fetchTenantsApi,
  logoutUserApi,
  resendVarificationEmailApi,
  resetPasswordsEmailApi,
  signInUsingEmailAndPassword,
  userAccountEmailApi,
  verifyEmailApi,
} from './authApi';

const initialState = {
  userData: null,
  managers: null,
  tenants: null,
  landloards: null,
  isAuthenticated: false,
};

export const userAccountEmailSlice = createAsyncThunk(
  'auth/userAccountEmailSlice',
  async (
    {
      navigation,
      photourl,
      email,
      fullName,
      phoneNumber,
      password,
      emailMarketing,
      pushNotification,
      role,
    },
    {dispatch},
  ) => {
    try {
      console.log(
        'values',
        email,
        fullName,
        phoneNumber,
        password,
        photourl,
        emailMarketing,
        pushNotification,
        role,
      );

      const response = await userAccountEmailApi({
        navigation,
        dispatch,
        email,
        photourl,
        fullName,
        phoneNumber,
        password,
        emailMarketing,
        pushNotification,
        role,
      });

      return response;
    } catch (error) {
      console.error('Error in userAccountEmailSlice:', error);
      throw error;
    }
  },
);

export const verifyEmailSlice = createAsyncThunk(
  'auth/verifyEmailSlice',
  async ({navigation, dispatch, verificationCode, uid, setIsInvalid}) => {
    return await verifyEmailApi({
      navigation,
      dispatch,
      verificationCode,
      uid,
      setIsInvalid,
    });
  },
);

export const resendVarificationEmailSlice = createAsyncThunk(
  'auth/resendVarificationEmail',
  async ({uid, email}) => {
    return await resendVarificationEmailApi({
      email,
      uid,
    });
  },
);
export const authSignInWithEmail = createAsyncThunk(
  'auth/signInUsingEmail',
  async ({navigation, password, email, dispatch, setSigninLoading}) => {
    console.log('in dispatch');

    return await signInUsingEmailAndPassword({
      navigation,
      password,
      email,
      dispatch,
      setSigninLoading,
    });
  },
);

export const resetPasswordsEmailSlice = createAsyncThunk(
  'auth/resetPassword',
  async ({email}) => {
    return await resetPasswordsEmailApi({
      email,
    });
  },
);

export const logoutUserSlice = createAsyncThunk(
  'auth/logoutUser',
  async ({uid}, {dispatch}) => {
    logoutUserApi({uid, dispatch});
  },
);

export const fetchManagers = createAsyncThunk(
  'auth/fetchManagers',
  async (_, {dispatch}) => {
    fetchManagersApi({dispatch});
  },
);

export const fetchTenants = createAsyncThunk(
  'auth/fetchManagers',
  async (_, {dispatch}) => {
    fetchTenantsApi({dispatch});
  },
);

export const fetchLandLoard = createAsyncThunk(
  'auth/fetchLandLoard',
  async (_, {dispatch}) => {
    fetchLandLoardApi({dispatch});
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    readUserDataSuccess: (state, {payload}) => {
      state.userData = payload.userData;
    },
    setIsAuthenticated: (state, {payload}) => {
      state.isAuthenticated = payload;
    },
    setManagers: (state, {payload}) => {
      state.managers = payload;
    },
    setTenants: (state, {payload}) => {
      state.tenants = payload;
    },
    setLandloards: (state, {payload}) => {
      state.landloards = payload;
    },
  },
});

export const {
  readUserDataSuccess,
  setIsAuthenticated,
  setManagers,
  setTenants,
} = authSlice.actions;
export default authSlice.reducer;
