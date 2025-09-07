/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../slices/authSlice";

const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "http://localhost:5000/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any)?.auth?.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth: typeof rawBaseQuery = async (args, api, extra) => {
  let result: any = await rawBaseQuery(args, api, extra);

  if (result?.error?.status === 401) {
    const refresh: any = await rawBaseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extra
    );
    const newAccess =
      refresh?.data?.data?.accessToken || refresh?.data?.accessToken;
    if (newAccess) {
      api.dispatch(setCredentials({ accessToken: newAccess }));
      result = await rawBaseQuery(args, api, extra);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Me", "Wallet"],
  endpoints: () => ({}),
});
