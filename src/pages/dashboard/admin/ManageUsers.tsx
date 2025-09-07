/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

import {
  useGetAllWalletsQuery,
  useUpdateWalletStatusMutation,
  type AdminWallet,
} from "../../../redux/api/adminApi";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

type WalletStatusFilter = "ALL" | "ACTIVE" | "BLOCKED";

const statusBadgeClass = (s?: string) => {
  switch ((s || "").toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
    case "BLOCKED":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300";
    default:
      return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
  }
};

const formatBDT = (value: number) =>
  `৳${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
const resolveJoinDate = (w: Partial<AdminWallet>): string => {
  const raw =
    (w as any).userJoinDate ||
    (w as any).joinedAt ||
    (w as any).userCreatedAt ||
    (w as any).createdAt;
  if (!raw) return "-";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(); 
};

const ManageUsers = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  const currentUserId = user?._id as string | undefined;

  const { data, isLoading, refetch } = useGetAllWalletsQuery();
  const [mutate, { isLoading: isUpdating }] = useUpdateWalletStatusMutation();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<WalletStatusFilter>("ALL");

  const wallets = (data?.data || []) as AdminWallet[];

  const [overrides, setOverrides] = useState<
    Record<string, "ACTIVE" | "BLOCKED">
  >({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState<{
    userId?: string;
    nextStatus?: "ACTIVE" | "BLOCKED";
    name?: string;
    email?: string;
    phone?: string;
  } | null>(null);

  const withEffectiveStatus = useMemo<AdminWallet[]>(
    () =>
      wallets.map((w) => ({
        ...w,
        walletStatus: (overrides[w.userId] ||
          w.walletStatus) as AdminWallet["walletStatus"],
      })),
    [wallets, overrides]
  );

  const filtered = useMemo(() => {
    const qLower = q.toLowerCase();
    let list = withEffectiveStatus.filter((w) =>
      [w.userName, w.userEmail, w.userPhone].some((v) =>
        v?.toLowerCase().includes(qLower)
      )
    );

    if (status !== "ALL") {
      list = list.filter(
        (w) => (w.walletStatus || "").toUpperCase() === status
      );
    }

    return list;
  }, [withEffectiveStatus, q, status]);

  const openConfirm = useCallback(
    (w: AdminWallet) => {
      if (currentUserId && w.userId === currentUserId) {
        toast.error("You cannot change your own wallet status.");
        return;
      }

      const next =
        (w.walletStatus || "").toUpperCase() === "ACTIVE"
          ? "BLOCKED"
          : "ACTIVE";
      setPending({
        userId: w.userId as string,
        nextStatus: next,
        name: w.userName,
        email: w.userEmail,
        phone: w.userPhone,
      });
      setConfirmOpen(true);
    },
    [currentUserId]
  );

  const applyToggle = useCallback(async () => {
    if (!pending?.userId || !pending?.nextStatus) {
      setConfirmOpen(false);
      return;
    }
    const { userId, nextStatus } = pending;

    if (currentUserId && userId === currentUserId) {
      setConfirmOpen(false);
      toast.error("You cannot change your own wallet status.");
      return;
    }

    setOverrides((m) => ({ ...m, [userId]: nextStatus }));

    setConfirmOpen(false);
    try {
      await mutate({ userId, walletStatus: nextStatus }).unwrap();
      toast.success(`Wallet is now ${nextStatus}.`);
    } catch {

      setOverrides((m) => {
        const clone = { ...m };
        delete clone[userId];
        return clone;
      });
      toast.error("Could not change wallet status. Please try again.");
    } finally {
      setPending(null);
      refetch();
    }
  }, [currentUserId, mutate, pending, refetch]);

  return (
    <div>
      <h2 className="text-3xl font-bold mt-8">Manage Users</h2>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Input
          className="w-72"
          placeholder="Search name / email / phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <Select
          value={status}
          onValueChange={(val: WalletStatusFilter) => setStatus(val)}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="BLOCKED">Blocked</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-neutral-500">
          {filtered.length} result(s)
        </div>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border dark:border-neutral-800">
        <table className="min-w-full text-sm text-center">
          <thead>
            <tr className="bg-neutral-50 text-center dark:bg-neutral-900/40">
              <th className="px-3 py-2">SL</th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Join Date</th>
              <th className="px-3 py-2">Balance</th>
              <th className="px-3 py-2">Active / Blocked</th>
              <th className="px-3 py-2">Wallet Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-3 py-6">
                  Loading...
                </td>
              </tr>
            ) : filtered.length ? (
              filtered.map((w, idx) => {
                const isActive =
                  (w.walletStatus || "").toUpperCase() === "ACTIVE";
                const isSelf = currentUserId && w.userId === currentUserId;

                return (
                  <tr
                    key={w._id}
                    className="border-t hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40"
                  >
                    <td className="px-3 py-2 font-medium">{idx + 1}</td>
                    <td className="px-3 py-2">{w.userName}</td>
                    <td className="px-3 py-2">{w.userEmail}</td>
                    <td className="px-3 py-2">{w.userPhone}</td>
                    <td className="px-3 py-2">{w.userRole}</td>
                    <td className="px-3 py-2">{resolveJoinDate(w)}</td>

                    <td className="px-3 py-2 font-mono">
                      {formatBDT(w.balance)}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center">
                        <Switch
                          className="cursor-pointer"
                          checked={isActive}
                          onCheckedChange={() => openConfirm(w)}
                          disabled={isUpdating || !!isSelf}
                        />
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <Badge className={statusBadgeClass(w.walletStatus)}>
                        {w.walletStatus}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-8 text-center text-neutral-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm wallet status change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              <span className="font-semibold">
                {pending?.nextStatus === "BLOCKED" ? "BLOCK" : "UNBLOCK"}
              </span>{" "}
              this wallet?
              <div className="mt-3 rounded-lg border p-3 text-sm dark:border-neutral-800">
                <div>
                  <span className="text-neutral-500">Name:</span>{" "}
                  <span className="font-medium">{pending?.name || "-"}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Email:</span>{" "}
                  <span className="font-medium">{pending?.email || "-"}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Phone:</span>{" "}
                  <span className="font-medium">{pending?.phone || "-"}</span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={applyToggle} disabled={isUpdating}>
              Yes, {pending?.nextStatus === "BLOCKED" ? "Block" : "Unblock"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageUsers;
