import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || "",
  tokenExpiration: Number(localStorage.getItem("tokenExpiration")) || 0,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{ token: string; expiration: number }>
    ) => {
      const { token, expiration } = action.payload;
      state.token = token;
      state.tokenExpiration = expiration;
      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expiration.toString());
    },
    clearToken: (state) => {
      state.token = "";
      state.tokenExpiration = 0;
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
    },
  },
});

export const { setToken, clearToken } = loginSlice.actions;

export default loginSlice.reducer;
