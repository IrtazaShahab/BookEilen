// Redux store setup for Next.js app
// Usage in a component:
// import { useAppDispatch, useAppSelector } from './redux/hooks';
// const dispatch = useAppDispatch();
// const user = useAppSelector(state => state.user.user);
// dispatch(setUser({ name: 'John' }));

import { configureStore, createSlice } from '@reduxjs/toolkit';

// Initial state for user slice
const initialState = {
    user: null,
};

// User slice with actions
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
});

// Export actions
export const { setUser, clearUser } = userSlice.actions;

// Create the Redux store
export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
});

// Types for use in hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
