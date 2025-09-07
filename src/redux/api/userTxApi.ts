import { baseApi } from "./baseApi";

export type UserTx = {
  _id: string;
  userId: string;
  userName: string;
  type: "CASH-IN" | "SEND-MONEY" | "CASHOUT";
  amount: number;
  receiver_phone?: string;
  transactionId:string;
  createdAt: string;
};

export const userTxApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserTransactions: builder.query<
      { statusCode: number; success: boolean; message: string; data: UserTx[] },
      { userId: string }
    >({
      query: ({ userId }) => `/user-transaction?userId=${userId}`,
    }),
  }),
});

export const { useGetUserTransactionsQuery } = userTxApi;
