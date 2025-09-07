import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "AGENT" | "ADMIN";
  createdAt?: string;
  isActive?: boolean;
};

type AuthState = {
  accessToken: string | null;
  user: TUser | null;
};

const initialState: AuthState = (() => {
  try {
    const raw = localStorage.getItem("__digipay_auth__");
    if (raw) return JSON.parse(raw) as AuthState;
  } catch {
    //
  }
  return { accessToken: null, user: null };
})();

const persist = (state: AuthState) =>
  localStorage.setItem("__digipay_auth__", JSON.stringify(state));

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user?: TUser }>
    ) => {
      if (action.payload.accessToken)
        state.accessToken = action.payload.accessToken;
      if (action.payload.user) state.user = action.payload.user;
      persist(state);
    },
    updateUser: (state, action: PayloadAction<Partial<TUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        persist(state);
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("__digipay_auth__");
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
