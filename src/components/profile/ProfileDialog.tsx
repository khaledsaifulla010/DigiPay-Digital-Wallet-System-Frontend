/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser, type TUser } from "@/redux/slices/authSlice";
import { useUpdateMeMutation } from "@/redux/api/userApi";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialUser: TUser | null | undefined;
};

export default function ProfileDialog({
  open,
  onOpenChange,
  initialUser,
}: Props) {
  const dispatch = useDispatch();
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const [name, setName] = useState(initialUser?.name ?? "");
  const [email, setEmail] = useState(initialUser?.email ?? "");
  const [phone, setPhone] = useState(initialUser?.phone ?? "");
  const [role, setRole] = useState(initialUser?.role ?? "");
  const [password, setPassword] = useState("");

  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!open) {
      hydratedRef.current = false;
      setPassword("");
      return;
    }
    if (open && !hydratedRef.current && initialUser) {
      setName(initialUser.name ?? "");
      setEmail(initialUser.email ?? "");
      setPhone(initialUser.phone ?? "");
      setRole(initialUser.role ?? "");
      hydratedRef.current = true;
    }
  }, [open, initialUser]);

  const nameRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => nameRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialUser) return;

    const payload: any = {};
    if (name !== initialUser.name) payload.name = name;
    if (phone !== initialUser.phone) payload.phone = phone;
    if (password.trim()) payload.password = password;

    if (Object.keys(payload).length === 0) {
      toast.info("No changes to update.");
      return;
    }

    try {
      const updated = await updateMe(payload).unwrap(); 
      
      dispatch(updateUser({ name: updated.name, phone: updated.phone }));
      toast.success("Profile updated successfully.");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" forceMount>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your name, phone, or password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoFocus
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email (read-only)</Label>
              <Input id="email" value={email} disabled />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">Role (read-only)</Label>
              <Input id="role" value={role} disabled />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">New Password (optional)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer"
            >
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
