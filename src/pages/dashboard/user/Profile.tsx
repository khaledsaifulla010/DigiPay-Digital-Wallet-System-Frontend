 import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User as UserIcon,
  Phone,
  Shield,
  Mail,
  CalendarClock,
  BadgeCheck,
  Hash,
} from "lucide-react";
import EditProfileButton from "@/components/profile/EditProfileButton";

const UserProfile = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  const getInitials = (name?: string, email?: string, phone?: string) => {
    const n = (name ?? "").trim();
    if (n) {
      const parts = n.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      } else {
        const letters = parts[0].replace(/[^A-Za-z]/g, "");
        return (
          letters.slice(0, 2).toUpperCase() ||
          (parts[0][0] || "U").toUpperCase()
        );
      }
    }

    const local = (email ?? "").split("@")[0];
    if (local) {
      const letters = local.replace(/[^A-Za-z]/g, "");
      return (
        letters.slice(0, 2).toUpperCase() || local.slice(0, 2).toUpperCase()
      );
    }
    if (phone) return phone.slice(-2).toUpperCase(); 
    return "U";
  };
  const initial = getInitials(user?.name, user?.email, user?.phone);
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "—";
  const role = user?.role || "USER";
  const status = user?.isActive === false ? "Inactive" : "Active";

  const roleBadge =
    role === "USER"
      ? "bg-pink-600"
      : role === "ADMIN"
      ? "bg-green-600"
      : "bg-purple-600";

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-3xl ">My Profile</h3>
        <div>
          <EditProfileButton />
        </div>
      </div>
      <div className="flex min-h-[70vh] items-center justify-center px-4 -mt-6">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="text-base font-bold border-2 border-dashed border-pink-600">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl">
                  {user?.name || "User"}
                </CardTitle>
                <CardDescription>User Profile Overview</CardDescription>
              </div>
              <div className="ml-auto flex gap-2">
                <Badge
                  className="bg-green-600 dark:text-white"
                  variant={status === "Active" ? "default" : "secondary"}
                >
                  <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                  {status}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="rounded-2xl border">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="w-1/3 font-medium">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Full Name
                      </div>
                    </TableCell>
                    <TableCell>{user?.name || "—"}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </div>
                    </TableCell>
                    <TableCell>{user?.phone || "—"}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </TableCell>
                    <TableCell>{user?.email || "—"}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Role
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${roleBadge} text-white font-bold mt-2`}
                        variant="secondary"
                      >
                        <Shield className="mr-1 h-4 w-4" />
                        {role}
                      </Badge>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4" />
                        Joined
                      </div>
                    </TableCell>
                    <TableCell>{joinDate}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        User ID
                      </div>
                    </TableCell>
                    <TableCell className="break-all">
                      {user?._id || "—"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
