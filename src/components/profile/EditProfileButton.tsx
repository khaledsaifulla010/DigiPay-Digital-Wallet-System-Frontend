import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import ProfileDialog from "./ProfileDialog";
import useRoleColor from "@/hooks/useRoleColor";

export default function EditProfileButton() {
  const [open, setOpen] = useState(false);
  const authUser = useSelector((s: RootState) => s.auth.user);
  const { buttonSolid } = useRoleColor();

  return (
    <>
      <Button
        onClick={() => {
          (document.activeElement as HTMLElement | null)?.blur?.();
          setOpen(true);
        }}
        className={`${buttonSolid} rounded-2xl cursor-pointer`}
      >
        <Pencil className="mr-1 h-4 w-4" /> Edit Profile
      </Button>

      <ProfileDialog
        open={open}
        onOpenChange={setOpen}
        initialUser={authUser}
      />
    </>
  );
}
