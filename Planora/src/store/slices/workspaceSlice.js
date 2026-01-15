import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// Async thunks
export const createWorkspace = createAsyncThunk(
  'workspace/create',
  async ({ name, userId }, { rejectWithValue }) => {
    try {
      const workspaceId = `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const workspaceRef = doc(db, 'workspaces', workspaceId);
      
      const workspaceData = {
        id: workspaceId,
        name,
        ownerId: userId,
        members: [userId],
        createdAt: serverTimestamp()
      };
      
      await setDoc(workspaceRef, workspaceData);
      
      return {
        ...workspaceData,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinWorkspace = createAsyncThunk(
  'workspace/join',
  async ({ workspaceId, userId }, { rejectWithValue }) => {
    try {
      const workspaceRef = doc(db, 'workspaces', workspaceId);
      const workspaceSnap = await getDoc(workspaceRef);
      
      if (!workspaceSnap.exists()) {
        return rejectWithValue('Workspace not found');
      }
      
      const workspaceData = workspaceSnap.data();
      
      // Add user to workspace members if not already a member
      if (!workspaceData.members.includes(userId)) {
        await updateDoc(workspaceRef, {
          members: arrayUnion(userId)
        });
      }
      
      return {
        id: workspaceId,
        ...workspaceData,
        members: workspaceData.members.includes(userId) 
          ? workspaceData.members 
          : [...workspaceData.members, userId]
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWorkspace = createAsyncThunk(
  'workspace/fetch',
  async (workspaceId, { rejectWithValue }) => {
    try {
      const workspaceRef = doc(db, 'workspaces', workspaceId);
      const workspaceSnap = await getDoc(workspaceRef);
      
      if (!workspaceSnap.exists()) {
        return rejectWithValue('Workspace not found');
      }
      
      return {
        id: workspaceId,
        ...workspaceSnap.data()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeMemberFromWorkspace = createAsyncThunk(
  'workspace/removeMember',
  async ({ workspaceId, userId }, { rejectWithValue }) => {
    try {
      const workspaceRef = doc(db, 'workspaces', workspaceId);
      await updateDoc(workspaceRef, {
        members: arrayRemove(userId)
      });
      
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    currentWorkspace: null,
    loading: false,
    error: null
  },
  reducers: {
    clearWorkspace: (state) => {
      state.currentWorkspace = null;
      state.error = null;
    },
    clearWorkspaceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create workspace
      .addCase(createWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.currentWorkspace = action.payload;
        state.loading = false;
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Join workspace
      .addCase(joinWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinWorkspace.fulfilled, (state, action) => {
        state.currentWorkspace = action.payload;
        state.loading = false;
      })
      .addCase(joinWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch workspace
      .addCase(fetchWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspace.fulfilled, (state, action) => {
        state.currentWorkspace = action.payload;
        state.loading = false;
      })
      .addCase(fetchWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove member
      .addCase(removeMemberFromWorkspace.fulfilled, (state, action) => {
        if (state.currentWorkspace) {
          state.currentWorkspace.members = state.currentWorkspace.members.filter(
            id => id !== action.payload
          );
        }
      });
  }
});

export const { clearWorkspace, clearWorkspaceError } = workspaceSlice.actions;
export default workspaceSlice.reducer;

