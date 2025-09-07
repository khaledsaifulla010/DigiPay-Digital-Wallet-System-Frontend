/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { RootState } from "@/redux/store";
import { useGetUserTransactionsQuery } from "@/redux/api/userTxApi";
import { useGetWalletQuery } from "@/redux/api/walletApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Wallet2, ArrowDownCircle, ArrowUpCircle, Percent } from "lucide-react";
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});
const fmtBDT = (v: number) =>
  currency
    .format(Number(v) || 0)
    .replace("BDT", "BDT")
    .trim();

const cardVariant = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const tooltipStyle: React.CSSProperties = {
  background: "var(--background)",
  color: "var(--foreground)",
  border: "1px solid hsl(var(--border))",
  borderRadius: 10,
  padding: 12,
  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
};

const TypeTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const total = payload.find((p: any) => p?.dataKey === "total")?.value ?? 0;
  return (
    <div style={tooltipStyle}>
      <div className="text-sm font-semibold mb-1">{label}</div>
      <div className="text-xs text-muted-foreground">Total</div>
      <div>{fmtBDT(total)}</div>
    </div>
  );
};

type CanonCat = "CASH_IN" | "CASH_OUT" | "SEND" | "OTHER";

const categorize = (raw: string): CanonCat => {
  const s = (raw || "").toUpperCase().replace(/\s+/g, "").replace(/_/g, "-");
  if (s === "CASH-IN") return "CASH_IN";
  if (s === "SEND-MONEY" || s === "SEND" || s === "TRANSFER") return "SEND";
  if (s === "CASHOUT" || s === "CASH-OUT" || s === "WITHDRAW")
    return "CASH_OUT";
  const t = (raw || "").toLowerCase().replace(/[^a-z]/g, "");
  if (
    t.includes("cashin") ||
    t.includes("deposit") ||
    t.includes("receive") ||
    t.includes("recharge") ||
    t.includes("topup") ||
    t.includes("agentcashin")
  )
    return "CASH_IN";
  if (t.includes("send") || t.includes("transfer")) return "SEND";
  if (t.includes("cashout") || t.includes("withdraw")) return "CASH_OUT";
  return "OTHER";
};

const colorForLabel = (label: string) => {
  if (label === "Cash-In") return "#22C55E";
  if (label === "Cash-Out") return "#EF4444";
  if (label === "Send Money") return "#F97316";
  return "hsl(var(--muted-foreground))";
};

const badgeClass = (rawType: string) => {
  const cat = categorize(rawType);
  if (cat === "CASH_OUT") return "bg-red-500/10 text-red-700 dark:text-red-400";
  if (cat === "CASH_IN")
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  if (cat === "SEND")
    return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
  return "bg-neutral-500/10 text-neutral-700 dark:text-neutral-300";
};
const UserOverview = () => {
  const { user } = useSelector((s: RootState) => s.auth);

  const { data: walletData, isLoading: walletLoading } = useGetWalletQuery();
  const balance = Number(walletData?.data?.balance ?? 0);

  const { data: txData, isLoading: txLoading } = useGetUserTransactionsQuery(
    { userId: user?._id as string },
    { skip: !user?._id }
  );

  const tx = Array.isArray(txData?.data) ? txData!.data : [];
  const byType = useMemo(() => {
    const buckets: Record<string, number> = {
      "Cash-In": 0,
      "Cash-Out": 0,
      "Send Money": 0,
    };

    for (const t of tx) {
      const cat = categorize((t as any).type);
      const amt = Math.abs(Number((t as any).amount) || 0);
      if (cat === "CASH_IN") buckets["Cash-In"] += amt;
      else if (cat === "CASH_OUT") buckets["Cash-Out"] += amt;
      else if (cat === "SEND") buckets["Send Money"] += amt;
    }

    return Object.entries(buckets).map(([type, total]) => ({ type, total }));
  }, [tx]);
  const totals = useMemo(() => {
    let inAmt = 0,
      outAmt = 0;
    for (const t of tx) {
      const cat = categorize((t as any).type);
      const amt = Math.abs(Number((t as any).amount) || 0);
      if (cat === "CASH_IN") inAmt += amt;
      else if (cat === "CASH_OUT" || cat === "SEND") outAmt += amt;
    }
    return { moneyIn: inAmt, moneyOut: outAmt };
  }, [tx]);

  const txCount = tx.length;

  const largest = useMemo(
    () =>
      tx.length
        ? tx
            .slice()
            .sort((a: any, b: any) => Number(b.amount) - Number(a.amount))[0]
        : null,
    [tx]
  );

  const lastActivity = useMemo(
    () => (tx.length ? new Date((tx as any[])[0].createdAt) : null),
    [tx]
  );

  const recent = tx.slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black mt-6 ">
        Welcome back,
        <span className="text-pink-600"> {user?.name || "User"}</span> !
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="ml-auto">
          {lastActivity
            ? `Last activity: ${lastActivity.toLocaleString()}`
            : "No activity yet"}
        </Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div variants={cardVariant} initial="hidden" animate="show">
          <Card id="tour-stats-card-1" className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="rounded-xl p-2 bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-pink-500/15">
                <Wallet2 className="size-6 text-pink-600 dark:text-pink-400" />
              </div>
              {walletLoading ? (
                <Skeleton className="h-7 w-40 rounded-md" />
              ) : (
                <div className="text-2xl font-bold">{fmtBDT(balance)}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariant} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Money In (Total)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="rounded-xl p-2 bg-emerald-500/10">
                <ArrowDownCircle className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              {txLoading ? (
                <Skeleton className="h-7 w-40 rounded-md" />
              ) : (
                <div className="text-2xl font-bold">
                  {fmtBDT(totals.moneyIn)}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariant} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Money Out (Total)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="rounded-xl p-2 bg-red-500/10">
                <ArrowUpCircle className="size-6 text-red-600 dark:text-red-400" />
              </div>
              {txLoading ? (
                <Skeleton className="h-7 w-40 rounded-md" />
              ) : (
                <div className="text-2xl font-bold">
                  {fmtBDT(totals.moneyOut)}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div id="tour-table-filters" className="grid gap-2 md:grid-cols-3">
        <motion.div variants={cardVariant} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="rounded-xl p-2 bg-primary/10">
                <Percent className="size-6 text-primary" />
              </div>
              {txLoading ? (
                <Skeleton className="h-7 w-24 rounded-md" />
              ) : (
                <div className="text-2xl font-bold">{txCount}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariant} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Largest Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              {txLoading ? (
                <Skeleton className="h-7 w-40 rounded-md" />
              ) : largest ? (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    {fmtBDT(Number((largest as any).amount))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(largest as any).type} •{" "}
                    {new Date((largest as any).createdAt).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">—</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariant} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="/dashboard/send">Send Money</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="/dashboard/withdraw">Withdraw</Link>
              </Button>
              <Button
                asChild
                className="rounded-xl bg-pink-600 text-white hover:bg-pink-700"
              >
                <Link to="/dashboard/deposit">Deposit</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={cardVariant} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Amounts by Type</CardTitle>
                <Button asChild variant="link" className="px-0">
                  <Link to="/dashboard/transactions">View details</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent id="tour-chart-1" className="h-72">
              {txLoading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byType}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="type"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tickFormatter={(v) =>
                        v >= 1000
                          ? `${(v / 1000).toFixed(1)}k`
                          : `${Number(v).toFixed(0)}`
                      }
                      width={60}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <ReTooltip content={<TypeTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="total"
                      name="Total"
                      barSize={36}
                      radius={[8, 8, 0, 0]}
                    >
                      {byType.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={colorForLabel(entry.type)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariant} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Share by Type</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {txLoading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byType}
                      dataKey="total"
                      nameKey="type"
                      label
                      innerRadius={55}
                      outerRadius={85}
                      stroke="hsl(var(--border))"
                    >
                      {byType.map((entry, i) => (
                        <Cell key={i} fill={colorForLabel(entry.type)} />
                      ))}
                    </Pie>
                    <Legend />
                    <ReTooltip
                      formatter={(value: number, name: string, props: any) => [
                        fmtBDT(value),
                        props?.payload?.type || name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <motion.div variants={cardVariant} initial="hidden" animate="show">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button asChild variant="link" className="px-0">
                <Link to="/dashboard/transactions">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border dark:border-neutral-800">
              <table className="min-w-full text-sm text-center">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-900/40">
                    <th className="px-3 py-2">SL</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Receiver / Sender</th>
                    <th className="px-3 py-2">Transaction ID</th>
                    <th className="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {txLoading ? (
                    <tr>
                      <td className="px-3 py-6" colSpan={4}>
                        <Skeleton className="h-6 w-1/2 mx-auto" />
                      </td>
                    </tr>
                  ) : recent.length ? (
                    recent.map((t: any, i) => (
                      <tr
                        key={t._id}
                        className="border-t hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40"
                      >
                        <td className="px-3 py-2">{i + 1}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass(
                              t.type
                            )}`}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-mono">
                          {fmtBDT(Number(t.amount))}
                        </td>
                        <td className="px-3 py-2">{t.receiver_phone || "-"}</td>
                        <td className="px-3 py-2">{t.transactionId || "-"}</td>
                        <td className="px-3 py-2">
                          {new Date(t.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-3 py-10 text-neutral-500" colSpan={4}>
                        No recent transactions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserOverview;
