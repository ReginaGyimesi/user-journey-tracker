import { configureStore } from "@reduxjs/toolkit";
import { usersApiSlice } from "./api/users";
import { analyticsApiSlice } from "./api/analytics";
import { sessionsApiSlice } from "./api/sessions";

export const store = configureStore({
  reducer: {
    [usersApiSlice.reducerPath]: usersApiSlice.reducer,
    [analyticsApiSlice.reducerPath]: analyticsApiSlice.reducer,
    [sessionsApiSlice.reducerPath]: sessionsApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersApiSlice.middleware)
      .concat(analyticsApiSlice.middleware)
      .concat(sessionsApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
