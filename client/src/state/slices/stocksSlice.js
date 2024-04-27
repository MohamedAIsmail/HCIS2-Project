import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define the initial state of the stocks slice
const initialState = {
  stocks: [], // This can be an array or any other structure that suits your data model
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk for fetching stocks
export const fetchStocks = createAsyncThunk(
  "stocks/fetchStocks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8080/getStocks");
      const data = await response.json();
      return data.stocks; // Assuming the JSON has a 'stocks' field
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setStocks: (state, action) => {
      state.stocks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions
export const { setStocks } = stocksSlice.actions;

// Export reducer
export default stocksSlice.reducer;
