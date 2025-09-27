// (Contents are exactly the same as previous response)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- DUMMY DATA ---


export const fetchBuses = createAsyncThunk(
  'bus/fetchBuses',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBusData;
  }
);

const busSlice = createSlice({
  name: 'bus',
  initialState: {
    data: [],
    loading: 'idle',
    searchTerm: '',
    currentPage: 1,
    entriesPerPage: 10,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    viewBus: (state, action) => { console.log(`Viewing Bus ID: ${action.payload}`); },
    deleteBus: (state, action) => { console.log(`Deleting Bus ID: ${action.payload}`); },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuses.pending, (state) => { state.loading = 'pending'; })
      .addCase(fetchBuses.fulfilled, (state, action) => { state.loading = 'succeeded'; state.data = action.payload; })
      .addCase(fetchBuses.rejected, (state) => { state.loading = 'failed'; });
  },
});

export const { setSearchTerm, setCurrentPage, viewBus, editBus, deleteBus } = busSlice.actions;

export const selectBusData = (state) => {
    const { data, searchTerm, currentPage, entriesPerPage } = state.bus;

    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = data.filter(bus =>
        Object.values(bus).some(value =>
            String(value).toLowerCase().includes(lowerCaseSearch)
        )
    );

    const startIndex = (currentPage - 1) * entriesPerPage;
    const paginated = filtered.slice(startIndex, startIndex + entriesPerPage);

    return {
        paginatedBuses: paginated,
        totalEntries: filtered.length,
        totalPages: Math.ceil(filtered.length / entriesPerPage),
    };
};

export default busSlice.reducer;