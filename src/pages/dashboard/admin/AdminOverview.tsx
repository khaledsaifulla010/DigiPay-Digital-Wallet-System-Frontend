/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Link } from "react-router-dom";

import {
  useGetAllUsersQuery,
  useGetAllTransactionsQuery,
} from "../../../redux/api/adminApi";
import { useGetWalletQuery } from "@/redux/api/walletApi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";

import {
  Wallet2,
  Users,
  Shield,
  UserCheck,
  UserX,
  ArrowDownCircle,
  ArrowUpCircle,
  Percent,
  ArrowRightLeft,
  ListChecks,
} from "lucide-react";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});
const fmtBDT = (v: number = 0) =>
  currency
    .format(Number(v) || 0)
    .replace("BDT", "BDT")
    .trim();

const tooltipStyle: React.CSSProperties = {
  background: "var(--background)",
  color: "var(--foreground)",
  border: "1px solid hsl(var(--border))",
  borderRadius: 10,
  padding: 12,
  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
};

const AmountTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const total =
    payload.find((p: any) => p.dataKey === "amount")?.value ??
    payload.find((p: any) => p.dataKey === "value")?.value ??
    0;
  return (
    <div style={tooltipStyle}>
      <div className="text-sm font-semibold mb-1">{label}</div>
      <div className="text-xs text-muted-foreground">Amount</div>
      <div>{fmtBDT(total)}</div>
    </div>
  );
};

const COLORS = {
  CASH_IN: "#22C55E",
  CASH_OUT: "#EF4444",
  SEND_MONEY: "#EC4899",
};
const AdminOverview = () => {
  const { user } = useSelector((s: RootState) => s.auth);

  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: txData, isLoading: txLoading } = useGetAllTransactionsQuery();
  const { data: walletData, isLoading: walletLoading } = useGetWalletQuery(
    undefined,
    { skip: !user?._id }
  );

  const users = usersData?.data || [];
  const tx = txData?.data || [];

  const userCounts = useMemo(() => {
    const total = users.length;
    const agents = users.filter((u: any) => u.role === "AGENT").length;
    const regulars = users.filter((u: any) => u.role === "USER").length;
    const blocked = users.filter((u: any) => u.status === "BLOCKED").length;
    const active = total - blocked;
    return { total, agents, regulars, blocked, active };
  }, [users]);

  const {
    totalVolume,
    avgTxValue,
    cashInAmount,
    cashOutAmount,
    sendMoneyAmount,
    cashInCount,
    cashOutCount,
    sendMoneyCount,
    barData,
    pieData,
    adminCommissionTotal,
    totalTransactions,
    avgSendMoneyValue,
  } = useMemo(() => {
    let volume = 0;
    let countAll = 0;

    let cashInAmt = 0;
    let cashOutAmt = 0;
    let sendAmt = 0;

    let cashInCnt = 0;
    let cashOutCnt = 0;
    let sendCnt = 0;

    let commissionSum = 0;

    tx.forEach((t: any) => {
      const amount = Number(t.amount) || 0;
      const commission = Number(t.adminCommission) || 0;

      volume += amount;
      commissionSum += commission;
      countAll += 1;

      const rawType = String(t.transactionType || "").toUpperCase();

      if (rawType.includes("SEND")) {
        sendAmt += amount;
        sendCnt += 1;
      } else if (rawType.includes("CASH") && rawType.includes("IN")) {
        cashInAmt += amount;
        cashInCnt += 1;
      } else if (
        rawType.includes("CASH") &&
        (rawType.includes("OUT") || rawType.includes("WITHDRAW"))
      ) {
        cashOutAmt += amount;
        cashOutCnt += 1;
      }
    });

    const barData = [
      { name: "Cash-In", amount: cashInAmt, color: COLORS.CASH_IN },
      { name: "Cash-Out", amount: cashOutAmt, color: COLORS.CASH_OUT },
      { name: "Send Money", amount: sendAmt, color: COLORS.SEND_MONEY },
    ];

    const pieData = [
      { name: "Cash-In", value: cashInAmt, color: COLORS.CASH_IN },
      { name: "Cash-Out", value: cashOutAmt, color: COLORS.CASH_OUT },
      { name: "Send Money", value: sendAmt, color: COLORS.SEND_MONEY },
    ];

    const avg = countAll ? volume / countAll : 0;
    const avgSend = sendCnt ? sendAmt / sendCnt : 0;

    return {
      totalVolume: volume,
      avgTxValue: avg,
      cashInAmount: cashInAmt,
      cashOutAmount: cashOutAmt,
      sendMoneyAmount: sendAmt,
      cashInCount: cashInCnt,
      cashOutCount: cashOutCnt,
      sendMoneyCount: sendCnt,
      barData,
      pieData,
      adminCommissionTotal: commissionSum,
      totalTransactions: countAll,
      avgSendMoneyValue: avgSend,
    };
  }, [tx]);

  const adminBalance = Number(walletData?.data?.balance ?? 0);
  const loading = usersLoading || txLoading;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black mt-6 ">
        Welcome back,
        <span className="text-green-600">
          {" "}
          {user?.name || "Admin"} (Admin){" "}
        </span>{" "}
        !
      </h2>

      <div className="grid gap-4 md:grid-cols-4">
        <Card id="tour-stats-card-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Admin Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-xl p-2 bg-green-500/10">
              <Wallet2 className="size-6 text-green-600 dark:text-green-400" />
            </div>
            {walletLoading ? (
              <Skeleton className="h-7 w-40 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">{fmtBDT(adminBalance)}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Cash-In (Amount)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-xl p-2" style={{ background: "#EC48991A" }}>
              <ArrowDownCircle
                className="size-6"
                style={{ color: COLORS.CASH_IN }}
              />
            </div>
            {txLoading ? (
              <Skeleton className="h-7 w-36 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">{fmtBDT(cashInAmount)}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Cash-Out (Amount)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-xl p-2" style={{ background: "#22C55E1A" }}>
              <ArrowUpCircle
                className="size-6"
                style={{ color: COLORS.CASH_OUT }}
              />
            </div>
            {txLoading ? (
              <Skeleton className="h-7 w-36 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">{fmtBDT(cashOutAmount)}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Send Money (Amount)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-xl p-2" style={{ background: "#EC48991A" }}>
              <ArrowRightLeft
                className="size-6"
                style={{ color: COLORS.SEND_MONEY }}
              />
            </div>
            {txLoading ? (
              <Skeleton className="h-7 w-40 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">
                {fmtBDT(sendMoneyAmount)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Admin Commission (Total)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-xl p-2 bg-primary/10">
              <Percent className="size-6 text-primary" />
            </div>
            {txLoading ? (
              <Skeleton className="h-7 w-40 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">
                {fmtBDT(adminCommissionTotal)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Volume (All Types)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <Skeleton className="h-7 w-40 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">{fmtBDT(totalVolume)}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Average Transaction Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <Skeleton className="h-7 w-32 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">{fmtBDT(avgTxValue)}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Avg Send Money Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <Skeleton className="h-7 w-32 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">
                {fmtBDT(avgSendMoneyValue)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-xl p-2 bg-primary/10">
              <Users className="size-6 text-primary" />
            </div>
            {loading ? (
              <Skeleton className="h-7 w-20 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">{userCounts.total}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-xl p-2 bg-purple-500/10">
              <Shield className="size-6 text-purple-600 dark:text-purple-400" />
            </div>
            {loading ? (
              <Skeleton className="h-7 w-20 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">{userCounts.agents}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Active Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-xl p-2 bg-emerald-500/10">
              <UserCheck className="size-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            {loading ? (
              <Skeleton className="h-7 w-20 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">{userCounts.active}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Cash-Out (Count)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <Skeleton className="h-7 w-24 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">{cashOutCount}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Blocked Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-xl p-2 bg-red-500/10">
              <UserX className="size-6 text-red-600 dark:text-red-400" />
            </div>
            {loading ? (
              <Skeleton className="h-7 w-20 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">{userCounts.blocked}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Cash-In (Count)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <Skeleton className="h-7 w-24 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">{cashInCount}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Send Money (Count)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <Skeleton className="h-7 w-24 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">{sendMoneyCount}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Transactions (All Types)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-xl p-2 bg-purple-500/10">
              <ListChecks className="size-6 text-purple-600 dark:text-purple-400" />
            </div>
            {txLoading ? (
              <Skeleton className="h-7 w-24 rounded-md" />
            ) : (
              <div className="text-2xl font-bold">{totalTransactions}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <div
              id="tour-table-filters"
              className="flex items-center justify-between"
            >
              <CardTitle>Volume by Transaction Type</CardTitle>
              <Button asChild variant="link" className="px-0">
                <Link to="/dashboard/transactions">View details</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent id="tour-chart-1" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip content={<AmountTooltip />} />
                <Legend />
                <Bar
                  dataKey="amount"
                  name="Amount"
                  barSize={40}
                  radius={[8, 8, 0, 0]}
                >
                  {barData.map((row, idx) => (
                    <Cell key={idx} fill={row.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Cash-In vs Cash-Out vs Send Money</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  label
                  innerRadius={55}
                  outerRadius={85}
                  stroke="hsl(var(--border))"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip content={<AmountTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
