/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useRegisterMutation } from "@/redux/api/authApi";
import { toast } from "react-toastify";

// shadcn/ui
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// icons
import { Eye, EyeOff } from "lucide-react";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "USER" | "AGENT";
};

const Register = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { role: "USER" },
  });

  const [signup, { isLoading }] = useRegisterMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await signup(values).unwrap();
      toast.success("Account created successfully!");
      navigate("/login", { replace: true });
    } catch (err: any) {
      const message = err?.data?.message || "Registration failed";
      setServerError(message);
      toast.error(message);
    }
  };

  // Frontend validations aligned with backend rules
  const phonePattern = /^(?:\+8801\d{9}|01\d{9})$/;
  const passwordUpper = /[A-Z]/;
  const passwordNum = /\d/;
  const passwordSpecial = /[!@#$%^&*]/;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-white px-4 dark:from-gray-950 dark:to-gray-900">
      <Card className="w-full max-w-xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-pink-600">
            Create an Account
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Choose your role (User or Agent). A wallet will be created
            automatically.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Rahim Uddin"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Min 2 characters" },
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="rahim@example.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone (BD format)</Label>
              <Input
                id="phone"
                placeholder="+8801XXXXXXXXX or 01XXXXXXXXX"
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: phonePattern,
                    message: "Invalid BD phone format",
                  },
                })}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Password + Role side by side */}
            <div className="flex gap-4">
              {/* Password */}
              <div className="grid gap-2 w-2/3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "Min 8 characters" },
                      validate: {
                        upper: (v) =>
                          passwordUpper.test(v) ||
                          "Must include an uppercase letter",
                        num: (v) =>
                          passwordNum.test(v) || "Must include a number",
                        special: (v) =>
                          passwordSpecial.test(v) ||
                          "Must include a special character",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-3 flex items-center text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="grid gap-2 w-1/3">
                <Label>Role</Label>
                <Controller
                  control={control}
                  name="role"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="AGENT">Agent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && (
                  <p className="text-sm text-red-600">Role is required</p>
                )}
              </div>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                {serverError}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-600 hover:bg-pink-700 cursor-pointer"
            >
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-pink-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
