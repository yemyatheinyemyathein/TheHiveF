import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RegistrationStateI {
  name: string;
  phoneNumber: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  referralCode: string;
}

const initialState: RegistrationStateI = {
  name: "",
  phoneNumber: "",
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  referralCode: "",
};

export const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setRegistrationState: (
      state,
      action: PayloadAction<Partial<RegistrationStateI>>
    ) => {
      return { ...state, ...action.payload };
    },

    clearRegistrationState: (state) => {
      return initialState;
    },
  },
});

export const { setRegistrationState, clearRegistrationState } =
  registrationSlice.actions;

export default registrationSlice.reducer;
