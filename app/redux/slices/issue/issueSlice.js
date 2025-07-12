import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {downloadFile} from 'react-native-fs'; // If not used, consider removing it
import {addIssueApi} from './issueApi';

// Initial state for issues
const initialState = {
  issues: [],
  currentIssue: null,
  loading: false,
  error: null,
};

// Thunk for adding an issue
export const addIssueThunk = createAsyncThunk(
  'issue/addIssue',
  async ({finalData}, {dispatch}) => {
    try {
      const response = await addIssueApi({
        finalData,
        dispatch,
      });
      return response;
    } catch (error) {
      console.error('Error in addIssueThunk:', error);
      throw error;
    }
  },
);

// Slice for issues
const issueSlice = createSlice({
  name: 'issue',
  initialState,
  reducers: {
    setCurrentIssue: (state, {payload}) => {
      state.currentIssue = payload;
    },
    clearIssueError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addIssueThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addIssueThunk.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.issues = [...state.issues, payload];
      })
      .addCase(addIssueThunk.rejected, (state, {error}) => {
        state.loading = false;
        state.error = error.message;
      });
  },
});

export const {setCurrentIssue, clearIssueError} = issueSlice.actions;
export default issueSlice.reducer;
