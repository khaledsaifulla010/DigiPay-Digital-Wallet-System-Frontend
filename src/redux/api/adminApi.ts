import { baseApi } from "./baseApi";

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "AGENT" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
  wallet?: string;
  createdAt?: string;
};

export type AdminWallet = {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userRole: "USER" | "AGENT" | "ADMIN";
  userStatus: "ACTIVE" | "BLOCKED";
  walletStatus: "ACTIVE" | "BLOCKED";
  balance: number;
  createdAt: string;
};

export type AdminTxn = {
  _id: string;
  senderId: string;
  senderName: string;
  senderRole: "USER" | "AGENT" | "ADMIN";
  receiverId: string;
  receiverName: string;
  receiverRole: "USER" | "AGENT" | "ADMIN";
  transactionType: "CASH-IN" | "SEND-MONEY" | "CASHOUT";
  transactionId: string;
  amount: number;
  adminCommission: number;
  sender_phone: string;
  receiver_phone: string;
  createdAt: string;
};

type Envelope<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<Envelope<AdminUser[]>, void>({
      query: () => `/user/all-users`,
    }),
    changeAgentStatus: builder.mutation<
      Envelope<AdminUser>,
      { userId: string; status: "ACTIVE" | "BLOCKED" }
    >({
      query: ({ userId, status }) => ({
        url: `/user/${userId}`,
        method: "PATCH",
        body: { status },
      }),
    }),

    getAllWallets: builder.query<Envelope<AdminWallet[]>, void>({
      query: () => `/wallet/all-wallets`,
    }),
    updateWalletStatus: builder.mutation<
      Envelope<AdminWallet>,
      { userId: string; walletStatus: "ACTIVE" | "BLOCKED" }
    >({
      query: ({ userId, walletStatus }) => ({
        url: `/wallet/${userId}`,
        method: "PATCH",
        body: { walletStatus },
      }),
    }),

    getAllTransactions: builder.query<Envelope<AdminTxn[]>, void>({
      query: () => `/transaction/all-transactions`,
    }),
    getTransactionById: builder.query<Envelope<AdminTxn>, { id: string }>({
      query: ({ id }) => `/transaction/${id}`,
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useChangeAgentStatusMutation,
  useGetAllWalletsQuery,
  useUpdateWalletStatusMutation,
  useGetAllTransactionsQuery,
  useGetTransactionByIdQuery,
} = adminApi;
