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
    token: null, // Add token to state
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token; // Save token
        },
        clearUser: (state) => {
            state.user = null;
            state.token = null;
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
// export type AppDispatch = {
//     token: string | null;
//     user: string;
// };

export type AppDispatch = typeof store.dispatch; // <-- Fix this line
