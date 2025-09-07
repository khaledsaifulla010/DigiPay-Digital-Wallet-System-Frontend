/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import {
  setCredentials,
  logout as doLogout,
  type TUser,
} from "../slices/authSlice";

type ApiEnvelope<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

type LoginResponse = {
  accessToken: string;
  user: TUser;
};

type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "USER" | "AGENT";
};

type LoginPayload = {
  emailOrPhone: string;
  password: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiEnvelope<LoginResponse>, LoginPayload>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          email: body.emailOrPhone,
          password: body.password,
        },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.accessToken || (data as any)?.accessToken;
          const user = data?.data?.user || (data as any)?.user;
          if (token && user) {
            dispatch(setCredentials({ accessToken: token, user }));
            dispatch(baseApi.util.invalidateTags(["Wallet", "Me"]));
          }
        } catch {//
          }
      },
    }),

    register: builder.mutation<ApiEnvelope<any>, RegisterPayload>({
      query: (body) => ({
        url: "/user/register",
        method: "POST",
        body,
      }),
    }),

    refresh: builder.mutation<ApiEnvelope<{ accessToken: string }>, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.accessToken || (data as any)?.accessToken;
          if (token) {
            const user = (getState() as any)?.auth?.user;
            dispatch(setCredentials({ accessToken: token, user }));
          }
        } catch {
          //
        }
      },
    }),

    logout: builder.mutation<ApiEnvelope<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(baseApi.util.resetApiState());
          dispatch(doLogout());
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
} = authApi;
