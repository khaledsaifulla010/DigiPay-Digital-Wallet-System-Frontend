/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  useGetUserTransactionsQuery,
  type UserTx,
} from "@/redux/api/userTxApi";
import type { RootState } from "@/redux/store";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, startOfDay, endOfDay } from "date-fns";

type FilterType = "ALL" | "SEND-MONEY" | "CASHOUT" | "CASH-IN";

const PAGE_SIZE = 10;

const formatBDT = (value: number) =>
  `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)} BDT`;

const badgeClass = (t: "CASH-IN" | "CASHOUT" | "SEND-MONEY") => {
  if (t === "CASH-IN") {
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  }
  if (t === "CASHOUT") {
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  }
  return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
};


function DatePickerInput({
  label,
  date,
  onChange,
  placeholder = "YYYY-MM-DD",
}: {
  label: string;
  date?: Date;
  onChange: (d?: Date) => void;
  placeholder?: string;
}) {
  const display = date ? format(date, "yyyy-MM-dd") : "";
  return (
    <div className="space-y-1">
      <label className="block text-xs text-neutral-500">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              readOnly
              value={display}
              placeholder={placeholder}
              className="pr-10"
            />
            <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="mb-2 text-sm text-pink-600 hover:underline"
          >
            Clear
          </button>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => onChange(d || undefined)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function getPageWindow(current: number, total: number, window = 5) {
  if (total <= window) return Array.from({ length: total }, (_, i) => i + 1);
  const half = Math.floor(window / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(total, start + window - 1);
  if (end - start + 1 < window) start = Math.max(1, end - window + 1);
  const pages: (number | "...")[] = [];
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total) {
    if (end < total - 1) pages.push("...");
    pages.push(total);
  }
  return pages;
}


const normalizePhone = (s: string) => s.replace(/[^\d]/g, "");
const includesCI = (hay?: string, needle?: string) =>
  (hay || "").toLowerCase().includes((needle || "").toLowerCase());

const UserTransactions = () => {
  const { user } = useSelector((s: RootState) => s.auth);

  const { data, isLoading } = useGetUserTransactionsQuery(
    { userId: user!._id },
    { skip: !user?._id }
  );

  const tx: UserTx[] = data?.data ?? [];

  const [type, setType] = useState<FilterType>("ALL");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const [search, setSearch] = useState<string>("");

  const filtered = useMemo(() => {
    let list = tx;

    if (type !== "ALL") list = list.filter((t) => t.type === type);

    if (fromDate) {
      const from = startOfDay(fromDate).getTime();
      list = list.filter((t) => new Date(t.createdAt).getTime() >= from);
    }
    if (toDate) {
      const to = endOfDay(toDate).getTime();
      list = list.filter((t) => new Date(t.createdAt).getTime() <= to);
    }

    const q = search.trim();
    if (q) {
      const qDigits = normalizePhone(q);
      list = list.filter((t) => {
        const rPhone = (t as any).receiver_phone as string | undefined;
        const sPhone = (t as any).sender_phone as string | undefined;
        const rEmail = (t as any).receiver_email as string | undefined;
        const sEmail = (t as any).sender_email as string | undefined;

        const emailHit = includesCI(rEmail, q) || includesCI(sEmail, q);

        const phoneHit =
          (rPhone && normalizePhone(rPhone).includes(qDigits)) ||
          (sPhone && normalizePhone(sPhone).includes(qDigits));

        return emailHit || phoneHit;
      });
    }

    return list;
  }, [tx, type, fromDate, toDate, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const slBase = (page - 1) * PAGE_SIZE;
  const pageList = getPageWindow(page, totalPages, 5);

  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <h2 className="text-3xl font-bold mt-8 mb-8">All Transaction History</h2>
      </div>

      <div className="mt-4 grid gap-3 rounded-xl border p-3 md:grid-cols-4 dark:border-neutral-800">
        <div className="space-y-1">
          <label className="block text-xs text-neutral-500">Type</label>
          <Select
            value={type}
            onValueChange={(v: FilterType) => {
              setType(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="SEND-MONEY">Send Money</SelectItem>
              <SelectItem value="CASHOUT">Cash-Out</SelectItem>
              <SelectItem value="CASH-IN">Cash-In</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DatePickerInput
          label="From"
          date={fromDate}
          onChange={(d) => {
            setFromDate(d);
            setPage(1);
          }}
        />
        <DatePickerInput
          label="To"
          date={toDate}
          onChange={(d) => {
            setToDate(d);
            setPage(1);
          }}
        />
        <div className="space-y-1">
          <label className="block text-xs text-neutral-500">
            Search ( phone )
          </label>
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="e.g. +8801724582013"
          />
        </div>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border dark:border-neutral-800">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-center bg-neutral-50 dark:bg-neutral-900/40">
              <th className="px-3 py-2">SL</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Receiver / Sender</th>
              <th className="px-3 py-2">Transaction ID</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : current.length ? (
              current.map((t, i) => (
                <tr
                  key={t._id}
                  className="border-t text-center hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40"
                >
                  <td className="px-3 py-2 font-medium">{slBase + i + 1}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass(
                        t.type as "CASH-IN" | "CASHOUT" | "SEND-MONEY"
                      )}`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono">{formatBDT(t.amount)}</td>
                  <td className="px-3 py-2">
                    {(t as any).receiver_phone ||
                      (t as any).receiver_email ||
                      (t as any).sender_phone ||
                      (t as any).sender_email ||
                      "-"}
                  </td>
                  <td className="px-3 py-2">{t.transactionId || "-"}</td>
                  <td className="px-3 py-2">
                    {new Date(t.createdAt).toLocaleString("en-US")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-10 text-center text-neutral-500"
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {pageList.map((p, idx) =>
              p === "..." ? (
                <PaginationItem key={idx}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(p as number);
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default UserTransactions;
