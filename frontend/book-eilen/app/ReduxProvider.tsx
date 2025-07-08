'use client';

// ReduxProvider wraps your app with the Redux store context.
// Usage: Place <ReduxProvider> at the top level of your layout or page.
// Example:
// <ReduxProvider>
//   <YourApp />
// </ReduxProvider>

import { Provider } from 'react-redux';
import { store } from './redux/store';
import React from 'react';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
