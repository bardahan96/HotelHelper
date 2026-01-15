import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// Async thunks
export const fetchVacations = createAsyncThunk(
  'vacations/fetchAll',
  async (workspaceId, { rejectWithValue }) => {
    try {
      const vacationsRef = collection(db, 'workspaces', workspaceId, 'vacations');
      const snapshot = await getDocs(vacationsRef);
      
      const vacations = [];
      snapshot.forEach((doc) => {
        vacations.push({ id: doc.id, ...doc.data() });
      });
      
      return vacations;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addVacation = createAsyncThunk(
  'vacations/add',
  async ({ workspaceId, vacationData, userId }, { rejectWithValue }) => {
    try {
      const vacationsRef = collection(db, 'workspaces', workspaceId, 'vacations');
      
      const newVacation = {
        ...vacationData,
        createdBy: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(vacationsRef, newVacation);
      
      return {
        id: docRef.id,
        ...newVacation,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateVacation = createAsyncThunk(
  'vacations/update',
  async ({ workspaceId, vacationId, updates }, { rejectWithValue }) => {
    try {
      const vacationRef = doc(db, 'workspaces', workspaceId, 'vacations', vacationId);
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(vacationRef, updateData);
      
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
  async ({ workspaceId, vacationId }, { rejectWithValue }) => {
    try {
      const vacationRef = doc(db, 'workspaces', workspaceId, 'vacations', vacationId);
      await deleteDoc(vacationRef);
      
      return vacationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const vacationsSlice = createSlice({
  name: 'vacations',
  initialState: {
    items: [],
    loading: false,
    error: null,
    syncing: false
  },
  reducers: {
    setVacations: (state, action) => {
      state.items = action.payload;
    },
    clearVacations: (state) => {
      state.items = [];
      state.error = null;
    },
    clearVacationsError: (state) => {
      state.error = null;
    },
    // Optimistic updates for real-time sync
    addVacationOptimistic: (state, action) => {
      state.items.push(action.payload);
    },
    updateVacationOptimistic: (state, action) => {
      const index = state.items.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteVacationOptimistic: (state, action) => {
      state.items = state.items.filter(v => v.id !== action.payload);
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

