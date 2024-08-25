import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./features/login/loginSlice";
import registerationSlice from "./features/registeration/registerationSlice";

export const store = configureStore({
  reducer: {
    login: loginSlice,
    registeration: registerationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
