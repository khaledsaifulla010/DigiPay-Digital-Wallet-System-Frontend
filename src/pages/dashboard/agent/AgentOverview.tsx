/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useGetWalletQuery } from "@/redux/api/walletApi";
import { useGetAgentStatsQuery } from "@/redux/api/agentApi";
import { Link } from "react-router-dom";
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
import { format, isBefore } from "date-fns";
import { motion } from "framer-motion";
import {
  Wallet2,
  ArrowUpCircle,
  ArrowDownCircle,
  Percent,
  CalendarClock,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

const AmountTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const amount = payload.find((p: any) => p.dataKey === "amount")?.value ?? 0;
  const commission =
    payload.find((p: any) => p.dataKey === "commission")?.value ?? 0;
  return (
    <div style={tooltipStyle}>
      <div className="text-sm font-semibold mb-1">{label}</div>
      <div className="text-xs text-muted-foreground">Amount</div>
      <div className="mb-1">{fmtBDT(amount)}</div>
      <div className="text-xs text-muted-foreground">Commission</div>
      <div>{fmtBDT(commission)}</div>
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0] || { name: "", value: 0 };
  return (
    <div style={tooltipStyle}>
      <div className="text-sm font-semibold mb-1">{name}</div>
      <div>{fmtBDT(Number(value))}</div>
    </div>
  );
};

const TYPE_LABEL: Record<"CASH-IN" | "CASH-OUT", "Cash-In" | "Cash-Out"> = {
  "CASH-IN": "Cash-In",
  "CASH-OUT": "Cash-Out",
};

const colorForLabel = (label: string) => {
  if (label === "Cash-In") return "#22C55E";
  if (label === "Cash-Out") return "#EF4444";
  return "hsl(var(--muted-foreground))";
};

const AgentOverview = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const handleFromSelect = (d?: Date) => {
    setFromDate(d);
    if (d && toDate && isBefore(toDate, d)) setToDate(undefined);
  };

  const fromStr = fromDate ? format(fromDate, "yyyy-MM-dd") : undefined;
  const toStr = toDate ? format(toDate, "yyyy-MM-dd") : undefined;
  const statsArgs =
    fromStr && toStr ? ({ from: fromStr, to: toStr } as const) : undefined;

  const { data: walletData, isLoading: walletLoading } = useGetWalletQuery(
    undefined,
    {
      skip: !user?._id,
    }
  );
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useGetAgentStatsQuery(user?._id ? statsArgs : undefined, {
    skip: !user?._id,
  });

  const balance = Number(walletData?.data?.balance ?? 0);

  const totalCashIn = Number(statsData?.data?.cashIn?.totalAmount ?? 0);
  const totalCashOut = Number(statsData?.data?.cashOut?.totalAmount ?? 0);
  const totalCommission = Number(
    statsData?.data?.overall?.totalCommission ?? 0
  );

  const cashInCount = Number(statsData?.data?.cashIn?.count ?? 0);
  const cashOutCount = Number(statsData?.data?.cashOut?.count ?? 0);

  const loading = statsLoading;

  const barData = useMemo(
    () => [
      {
        type: "CASH-IN",
        label: TYPE_LABEL["CASH-IN"],
        amount: totalCashIn,
        commission: Number(statsData?.data?.cashIn?.totalCommission ?? 0),
      },
      {
        type: "CASH-OUT",
        label: TYPE_LABEL["CASH-OUT"],
        amount: totalCashOut,
        commission: Number(statsData?.data?.cashOut?.totalCommission ?? 0),
      },
    ],
    [totalCashIn, totalCashOut, statsData]
  );
  const pieData = useMemo(
    () => [
      { name: TYPE_LABEL["CASH-IN"], value: totalCashIn },
      { name: TYPE_LABEL["CASH-OUT"], value: totalCashOut },
    ],
    [totalCashIn, totalCashOut]
  );

  const canApply = Boolean(fromDate && toDate);
  const handleApply = async () => {
    if (canApply) await refetchStats();
  };
  const handleClear = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black mt-6 ">
        Welcome back,
        <span className="text-purple-600"> {user?.name || "Agent"}</span> !
      </h2>
      <Card id="tour-table-filters">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarClock className="size-5 text-primary" />
            Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[220px] justify-start text-left font-normal",
                  !fromDate && "text-muted-foreground"
                )}
              >
                {fromDate ? (
                  format(fromDate, "LLL dd, yyyy")
                ) : (
                  <span>From date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={(d) => handleFromSelect(d ?? undefined)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[220px] justify-start text-left font-normal",
                  !toDate && "text-muted-foreground"
                )}
              >
                {toDate ? format(toDate, "LLL dd, yyyy") : <span>To date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={(d) => setToDate(d ?? undefined)}
                disabled={(date) =>
                  Boolean(fromDate && isBefore(date, fromDate))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button onClick={handleApply} disabled={!canApply}>
            Apply
          </Button>
          <Button variant="ghost" onClick={handleClear}>
            Clear
          </Button>

          <Badge variant="outline" className="ml-auto">
            {fromDate && toDate
              ? `Applied: ${format(fromDate, "LLL dd, yyyy")} - ${format(
                  toDate,
                  "LLL dd, yyyy"
                )}`
              : "No range selected"}
          </Badge>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div variants={cardVariant} initial="hidden" animate="show">
          <Card id="tour-stats-card-1" className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Agent Balance
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
                Total Cash-In (Count)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="rounded-xl p-2 bg-emerald-500/10">
                <ArrowDownCircle className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              {loading ? (
                <Skeleton className="h-7 w-24 rounded-md" />
              ) : (
                <div className="text-2xl font-bold">{cashInCount}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariant} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Cash-Out (Count)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="rounded-xl p-2 bg-red-500/10">
                <ArrowUpCircle className="size-6 text-red-600 dark:text-red-400" />
              </div>
              {loading ? (
                <Skeleton className="h-7 w-24 rounded-md" />
              ) : (
                <div className="text-2xl font-bold">{cashOutCount}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div variants={cardVariant} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Cash-In Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-40 rounded-md" />
              ) : (
                <div className="text-2xl font-bold">{fmtBDT(totalCashIn)}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariant} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Cash-Out Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-40 rounded-md" />
              ) : (
                <div className="text-2xl font-bold">{fmtBDT(totalCashOut)}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariant} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Commission Earned
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="rounded-xl p-2 bg-primary/10">
                <Percent className="size-6 text-primary" />
              </div>
              {loading ? (
                <Skeleton className="h-7 w-40 rounded-md" />
              ) : (
                <div className="text-2xl font-bold">
                  {fmtBDT(totalCommission)}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {statsError && (
        <Alert variant="destructive">
          <AlertTitle>Could not load stats</AlertTitle>
          <AlertDescription>
            Please try again. If the issue continues, refresh the page or change
            the date range.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Amounts Snapshot</CardTitle>
              <Button asChild variant="link" className="px-0">
                <Link to="/dashboard/transactions">View details</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent id="tour-chart-1" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
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
                <Tooltip content={<AmountTooltip />} />
                <Legend />
                <Bar
                  dataKey="amount"
                  name="Amount"
                  barSize={36}
                  radius={[8, 8, 0, 0]}
                >
                  {barData.map((entry, idx) => (
                    <Cell
                      key={`cell-amount-${idx}`}
                      fill={
                        entry.label === "Cash-In"
                          ? colorForLabel("Cash-In")
                          : colorForLabel("Cash-Out")
                      }
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="commission"
                  name="Commission"
                  barSize={28}
                  radius={[8, 8, 0, 0]}
                  fill="hsl(var(--muted-foreground) / 0.5)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Cash-In vs Cash-Out (Share)</CardTitle>
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
                    <Cell key={i} fill={colorForLabel(entry.name)} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentOverview;
