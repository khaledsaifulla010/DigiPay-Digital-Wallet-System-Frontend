/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Wallet,
  Loader2,
  CircleAlert,
  Phone,
  Send,
  RotateCcw,
  MoveRight,
} from "lucide-react";
import type { RootState } from "@/redux/store";
import { useTransferMutation, useGetWalletQuery } from "@/redux/api/walletApi";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type FormValues = {
  senderPhone: string;
  receiverPhone: string;
  amount: number | string;
};

const SendMoney = () => {
  const { user } = useSelector((s: RootState) => s.auth);

  const [transfer, { isLoading }] = useTransferMutation();
  const { data: walletData, refetch: refetchWallet } = useGetWalletQuery(
    undefined,
    { skip: !user?._id }
  );
  const balance = Number(walletData?.data?.balance ?? 0);

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      senderPhone: user?.phone || "",
      receiverPhone: "",
      amount: "" as unknown as number,
    },
    mode: "onChange",
  });

  const phonePattern = /^(?:\+8801\d{9}|01\d{9})$/;

  const onSubmit = async (v: FormValues) => {
    setMessage(null);
    try {
      const res: any = await transfer({
        senderPhone: v.senderPhone,
        receiverPhone: v.receiverPhone,
        amount: Number(v.amount),
      }).unwrap();

      setMessage(res?.message || "Transfer successful");
      setMessageType("success");
      toast.success(res?.message || "Transfer successful", {
        style: { width: "650px" },
      });
      await refetchWallet();
      form.reset({
        senderPhone: user?.phone || "",
        receiverPhone: "",
        amount: "" as unknown as number,
      });

      setConfirmOpen(false);
    } catch (err: any) {
      const msg = err?.data?.message || "Transfer failed";
      setMessage(msg);
      setMessageType("error");
      toast.error(msg, { style: { width: "400px" } });
    }
  };
  const values = form.getValues();
  const isValid =
    form.formState.isValid &&
    Number(values.amount) > 0 &&
    phonePattern.test(String(values.receiverPhone || ""));

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-2">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 bg-pink-600 text-white font-bold"
            >
              You <MoveRight className="mt-0.5" /> Receiver
            </Badge>
            <span className="text-sm text-muted-foreground">
              Instant transfer to another user
            </span>
          </div>
          <CardTitle className="text-2xl font-bold -mt-1">Send Money</CardTitle>
          <CardDescription className="-mt-2">
            Transfer funds safely using the receiver’s mobile number.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-2">
            <div className="col-span-2 rounded-2xl border bg-card p-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5" />
                <div className="text-sm text-muted-foreground">
                  Your Current Balance
                </div>
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">
                BDT {balance.toFixed(2)}
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-2xl border bg-card p-4 cursor-help">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5" />
                      <div className="text-sm text-muted-foreground">
                        Your Phone
                      </div>
                    </div>
                    <div className="mt-2 font-medium">
                      {user?.phone || "N/A"}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Auto-filled from your profile.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Separator />
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setMessage(null);
                setConfirmOpen(true);
              }}
              className="grid gap-5"
            >
              <FormField
                control={form.control}
                name="senderPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Phone</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-muted/40" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiverPhone"
                rules={{
                  required: "Receiver phone is required",
                  pattern: {
                    value: phonePattern,
                    message: "Invalid BD phone (e.g., 01XXXXXXXXX)",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receiver Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="01XXXXXXXXX"
                        inputMode="numeric"
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^\d+]/g, "");
                          field.onChange(val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                rules={{
                  required: "Amount is required",
                  min: { value: 1, message: "Minimum amount is 1" },
                  validate: (v) => Number(v) > 0 || "Enter a valid amount",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (BDT)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        step="1"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        className="rounded-xl bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                        onClick={() =>
                          form.reset({
                            senderPhone: user?.phone || "",
                            receiverPhone: "",
                            amount: "" as unknown as number,
                          })
                        }
                      >
                        Reset <RotateCcw className="-ml-1 mt-0.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear all fields to start over.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl px-6 bg-pink-600 text-white hover:bg-pink-700 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      Send <Send className="h-4 w-4 mt-1" />
                    </span>
                  )}
                </Button>
              </div>
              {message && (
                <Alert
                  variant={messageType === "error" ? "destructive" : "default"}
                  className="rounded-xl"
                >
                  <CircleAlert className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Transfer</DialogTitle>
                <DialogDescription>
                  Please review the details before sending money.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">From (You)</span>
                  <span className="font-medium">
                    {values.senderPhone || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">To (Receiver)</span>
                  <span className="font-medium">
                    {values.receiverPhone || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold">
                    BDT {Number(values.amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConfirmOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => form.handleSubmit(onSubmit)()}
                  disabled={!isValid || isLoading}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      Confirm <Send className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendMoney;
