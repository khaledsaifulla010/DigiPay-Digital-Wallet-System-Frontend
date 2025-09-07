import { baseApi } from "./baseApi";

export type AgentCommissionTx = {
  _id: string;
  userId: string;
  type: "CASH-IN" | "CASHOUT";
  amount: number;
  commission: number;
  reference?: string;
  receiverPhone?: string;
  transactionId: string;
  createdAt: string;
};

type Envelope<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

type AgentTxList = {
  items: AgentCommissionTx[];
  meta: { page: number; limit: number; total: number; pages: number };
};

export type AgentStats = {
  overall: { totalAmount: number; totalCommission: number; count: number };
  cashIn: { totalAmount: number; totalCommission: number; count: number };
  cashOut: { totalAmount: number; totalCommission: number; count: number };
};

type StatsArg =
  | { range: "today" | "7d" | "30d"; from?: undefined; to?: undefined }
  | { range?: undefined; from: string; to?: string };

export const agentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgentTransactions: builder.query<
      Envelope<AgentTxList>,
      { userId?: string; page?: number; limit?: number }
    >({
      query: ({ userId, page, limit }) => {
        const params = new URLSearchParams();
        if (userId) params.set("userId", userId);
        if (page) params.set("page", String(page));
        if (limit) params.set("limit", String(limit));
        const qs = params.toString();
        return `/agent-commission${qs ? `?${qs}` : ""}`;
      },
    }),

    getAgentStats: builder.query<Envelope<AgentStats>, StatsArg | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && "range" in args && args?.range)
          params.set("range", args.range);
        if (args && "from" in args && args?.from) params.set("from", args.from);
        if (args && "to" in args && args?.to) params.set("to", args.to);
        const qs = params.toString();
        return `/agent-commission/stats${qs ? `?${qs}` : ""}`;
      },
    }),
  }),
});

export const { useGetAgentTransactionsQuery, useGetAgentStatsQuery } = agentApi;
