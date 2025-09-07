 
import { useMemo, useState, useCallback } from "react";
import {
  useGetAllUsersQuery,
  useChangeAgentStatusMutation,
  type AdminUser,
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

type StatusFilter = "ALL" | "ACTIVE" | "BLOCKED" | "INACTIVE" | "UNBLOCKED";

const statusBadgeClass = (s?: string) => {
  switch ((s || "").toUpperCase()) {
    case "ACTIVE":
    case "UNBLOCKED":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
    case "BLOCKED":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300";
    default:
      return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
  }
};

const ManageAgents = () => {
  const { data, isLoading, refetch } = useGetAllUsersQuery();
  const [mutate, { isLoading: isUpdating }] = useChangeAgentStatusMutation();


  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");


  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState<{
    userId?: string;
    nextStatus?: "ACTIVE" | "BLOCKED";
    name?: string;
    email?: string;
    phone?: string;
  } | null>(null);

  const agents = useMemo<AdminUser[]>(
    () => (data?.data || []).filter((u: AdminUser) => u.role === "AGENT"),
    [data]
  );


  const withEffectiveStatus = useMemo<AdminUser[]>(
    () =>
      agents.map((a) => ({
        ...a,
        status: (overrides[a._id] || a.status) as AdminUser["status"],
      })),
    [agents, overrides]
  );

  const filtered = useMemo(() => {
    const qLower = q.toLowerCase();
    let list = withEffectiveStatus.filter((a) =>
      [a.name, a.email, a.phone].some((v) => v?.toLowerCase().includes(qLower))
    );

    if (status !== "ALL") {
      const target =
        status === "UNBLOCKED"
          ? ("ACTIVE" as const)
          : (status as AdminUser["status"]);
      list = list.filter((a) => (a.status || "").toUpperCase() === target);
    }

    return list;
  }, [withEffectiveStatus, q, status]);

  const openConfirm = useCallback((a: AdminUser) => {
    const next =
      (a.status || "").toUpperCase() === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setPending({
      userId: a._id,
      nextStatus: next,
      name: a.name,
      email: a.email,
      phone: a.phone,
    });
    setConfirmOpen(true);
  }, []);

  const applyToggle = useCallback(async () => {
    if (!pending?.userId || !pending?.nextStatus) {
      setConfirmOpen(false);
      return;
    }
    const { userId, nextStatus } = pending;

    setOverrides((m) => ({ ...m, [userId]: nextStatus }));

    setConfirmOpen(false);
    try {
      await mutate({ userId, status: nextStatus }).unwrap();
      toast.success(`Agent is now ${nextStatus}.`);
    } catch {

      setOverrides((m) => {
        const clone: Record<string, string> = { ...m };
        delete clone[userId];
        return clone;
      });
      toast.error("Could not change the status. Please try again.");
    } finally {
      setPending(null);
      refetch();
    }
  }, [mutate, pending, refetch]);

  return (
    <div>
      <h2 className="text-3xl font-bold mt-8">Manage Agents</h2>


      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Input
          className="w-72"
          placeholder="Search name / email / phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <Select
          value={status}
          onValueChange={(val: StatusFilter) => setStatus(val)}
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
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Active / Blocked</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-3 py-6">
                  Loading...
                </td>
              </tr>
            ) : filtered.length ? (
              filtered.map((a, idx) => {
                const isActive = (a.status || "").toUpperCase() === "ACTIVE";
                return (
                  <tr
                    key={a._id}
                    className="border-t hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40"
                  >
                    <td className="px-3 py-2 font-medium">{idx + 1}</td>
                    <td className="px-3 py-2">{a.name}</td>
                    <td className="px-3 py-2">{a.email}</td>
                    <td className="px-3 py-2">{a.phone}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center">
                        <Switch
                          className="cursor-pointer"
                          checked={isActive}
                          onCheckedChange={() => openConfirm(a)}
                          disabled={isUpdating}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <Badge className={statusBadgeClass(a.status)}>
                        {a.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-neutral-500"
                >
                  No agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm status change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              <span className="font-semibold">
                {pending?.nextStatus === "BLOCKED" ? "BLOCK" : "UNBLOCK"}
              </span>{" "}
              this agent?
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

export default ManageAgents;
