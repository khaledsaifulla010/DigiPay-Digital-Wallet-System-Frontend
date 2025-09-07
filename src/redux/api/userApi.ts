 
import { baseApi } from "./baseApi";
import { updateUser, type TUser } from "../slices/authSlice";

export type MeResponse = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "AGENT" | "ADMIN";
  status?: "ACTIVE" | "BLOCKED";
  createdAt?: string;
};

type ApiEnvelope<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export type UpdateMePayload = {
  name?: string;
  phone?: string;
  password?: string;
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => ({ url: "/user/me", method: "GET" }),

      transformResponse: (res: ApiEnvelope<MeResponse>) => res.data,
      providesTags: ["Me"],

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled; 
          const nextAuthUser: Partial<TUser> = {
            _id: data._id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
          };
          dispatch(updateUser(nextAuthUser));
        } catch {
          /* noop */
        }
      },
    }),

    updateMe: build.mutation<MeResponse, UpdateMePayload>({
      query: (body) => ({ url: "/user/me", method: "PATCH", body }),
      transformResponse: (res: ApiEnvelope<MeResponse>) => res.data,
      invalidatesTags: ["Me"], 
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: updated } = await queryFulfilled;

          dispatch(
            updateUser({
              name: updated.name,
              phone: updated.phone,
            })
          );
        } catch {
          //
        }
      },
    }),
  }),
});

export const { useGetMeQuery, useUpdateMeMutation } = userApi;
