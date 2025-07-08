// Redux hooks for use in your components
// Usage example:
// import { useAppDispatch, useAppSelector } from './redux/hooks';
// const dispatch = useAppDispatch();
// const user = useAppSelector(state => state.user.user);

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
