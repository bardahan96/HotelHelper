import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// AUTH DISABLED - Using local storage instead of Firestore
// import { 
//   collection, 
//   doc, 
//   addDoc, 
//   updateDoc, 
//   deleteDoc, 
//   getDocs,
//   serverTimestamp 
// } from 'firebase/firestore';
// import { db } from '../../config/firebase';

// Local storage helper
const STORAGE_KEY = 'planora-vacations-local';

const saveToLocalStorage = (vacations) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vacations));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return [];
  }
};

// Async thunks (LOCAL STORAGE MODE)
export const fetchVacations = createAsyncThunk(
  'vacations/fetchAll',
  async (workspaceId, { rejectWithValue }) => {
    try {
      // Load from local storage
      const vacations = loadFromLocalStorage();
      return vacations;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addVacation = createAsyncThunk(
  'vacations/add',
  async ({ workspaceId, vacationData, userId }, { rejectWithValue, getState }) => {
    try {
      const newVacation = {
        ...vacationData,
        id: Date.now().toString(), // Simple ID generation
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const currentVacations = getState().vacations.items;
      const updatedVacations = [...currentVacations, newVacation];
      saveToLocalStorage(updatedVacations);
      
      return newVacation;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateVacation = createAsyncThunk(
  'vacations/update',
  async ({ workspaceId, vacationId, updates }, { rejectWithValue, getState }) => {
    try {
      const currentVacations = getState().vacations.items;
      const updatedVacations = currentVacations.map(v => 
        v.id === vacationId 
          ? { ...v, ...updates, updatedAt: new Date().toISOString() }
          : v
      );
      saveToLocalStorage(updatedVacations);
      
      return {
        id: vacationId,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteVacation = createAsyncThunk(
  'vacations/delete',
  async ({ workspaceId, vacationId }, { rejectWithValue, getState }) => {
    try {
      const currentVacations = getState().vacations.items;
      const updatedVacations = currentVacations.filter(v => v.id !== vacationId);
      saveToLocalStorage(updatedVacations);
      
      return vacationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const vacationsSlice = createSlice({
  name: 'vacations',
  initialState: {
    items: loadFromLocalStorage(), // Load from localStorage on init
    loading: false,
    error: null,
    syncing: false
  },
  reducers: {
    setVacations: (state, action) => {
      state.items = action.payload;
      saveToLocalStorage(action.payload);
    },
    clearVacations: (state) => {
      state.items = [];
      state.error = null;
      saveToLocalStorage([]);
    },
    clearVacationsError: (state) => {
      state.error = null;
    },
    // Optimistic updates for real-time sync
    addVacationOptimistic: (state, action) => {
      state.items.push(action.payload);
      saveToLocalStorage(state.items);
    },
    updateVacationOptimistic: (state, action) => {
      const index = state.items.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        saveToLocalStorage(state.items);
      }
    },
    deleteVacationOptimistic: (state, action) => {
      state.items = state.items.filter(v => v.id !== action.payload);
      saveToLocalStorage(state.items);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch vacations
      .addCase(fetchVacations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacations.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchVacations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add vacation
      .addCase(addVacation.pending, (state) => {
        state.syncing = true;
        state.error = null;
      })
      .addCase(addVacation.fulfilled, (state, action) => {
        // Check if already added by optimistic update
        const exists = state.items.find(v => v.id === action.payload.id);
        if (!exists) {
          state.items.push(action.payload);
        }
        state.syncing = false;
      })
      .addCase(addVacation.rejected, (state, action) => {
        state.syncing = false;
        state.error = action.payload;
      })
      // Update vacation
      .addCase(updateVacation.pending, (state) => {
        state.syncing = true;
        state.error = null;
      })
      .addCase(updateVacation.fulfilled, (state, action) => {
        const index = state.items.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
        state.syncing = false;
      })
      .addCase(updateVacation.rejected, (state, action) => {
        state.syncing = false;
        state.error = action.payload;
      })
      // Delete vacation
      .addCase(deleteVacation.pending, (state) => {
        state.syncing = true;
        state.error = null;
      })
      .addCase(deleteVacation.fulfilled, (state, action) => {
        state.items = state.items.filter(v => v.id !== action.payload);
        state.syncing = false;
      })
      .addCase(deleteVacation.rejected, (state, action) => {
        state.syncing = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setVacations, 
  clearVacations, 
  clearVacationsError,
  addVacationOptimistic,
  updateVacationOptimistic,
  deleteVacationOptimistic
} = vacationsSlice.actions;

export default vacationsSlice.reducer;

