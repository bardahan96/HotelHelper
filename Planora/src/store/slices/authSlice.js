import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';

// Async thunks
export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      await signInWithRedirect(auth, googleProvider);
      return null; // User will be redirected, result handled in initAuthListener
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOutUser = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Listen to auth state changes
export const initAuthListener = () => (dispatch) => {
  // Check for redirect result first
  getRedirectResult(auth).catch((error) => {
    console.error('Redirect result error:', error);
    dispatch(setAuthLoading(false));
  });
  
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));
    } else {
      dispatch(setUser(null));
    }
    dispatch(setAuthLoading(false));
  });
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Sign in with Google
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        // With redirect, user will be set by onAuthStateChanged
        state.loading = true; // Keep loading until redirect completes
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign out
      .addCase(signOutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setUser, setAuthLoading, clearError } = authSlice.actions;
export default authSlice.reducer;

