/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

type TransferPayload = {
  senderPhone: string;
  receiverPhone: string;
  amount: number;
};

type WithdrawPayload = {
  senderPhone: string;
  receiverPhone: string;
  amount: number;
};

type CashInPayload = {
  senderPhone: string;
  receiverPhone: string;
  amount: number;
};

type ApiEnvelope<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWallet: builder.query<ApiEnvelope<{ balance: number }>, void>({
      query: () => `/wallet/me`,
      providesTags: ["Wallet"],
      keepUnusedDataFor: 0,
      forceRefetch() {
        return true;
      },
    }),

    transfer: builder.mutation<ApiEnvelope<any>, TransferPayload>({
      query: (body) => ({
        url: "/wallet/transfer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet", "Me"],
    }),

    withdraw: builder.mutation<ApiEnvelope<any>, WithdrawPayload>({
      query: (body) => ({
        url: "/wallet/withdraw",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet", "Me"],
    }),

    cashIn: builder.mutation<ApiEnvelope<any>, CashInPayload>({
      query: (body) => ({
        url: "/wallet/cashIn",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet", "Me"],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useTransferMutation,
  useWithdrawMutation,
  useCashInMutation,
} = walletApi;
