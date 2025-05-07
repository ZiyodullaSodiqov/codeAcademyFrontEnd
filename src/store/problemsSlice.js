import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProblems, fetchProblemById } from '../api/problemService';

export const getProblems = createAsyncThunk(
  'problems/getProblems',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProblems();
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getProblem = createAsyncThunk(
  'problems/getProblem',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchProblemById(id);
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const problemsSlice = createSlice({
  name: 'problems',
  initialState: {
    problems: [],
    currentProblem: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload;
      })
      .addCase(getProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProblem = action.payload;
      })
      .addCase(getProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default problemsSlice.reducer;