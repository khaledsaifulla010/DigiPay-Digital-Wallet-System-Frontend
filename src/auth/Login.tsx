/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useLoginMutation } from "@/redux/api/authApi";
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

// icons
import { Eye, EyeOff, MoveLeft } from "lucide-react";

type FormValues = {
  emailOrPhone: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [login, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const res: any = await login(values).unwrap();
      const ok = res?.success ?? true;

      if (ok) {
        toast.success("Login successful");
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      const message = err?.data?.message || "Login failed";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-white dark:from-gray-950 dark:to-gray-900 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-pink-600">
            Welcome Back
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Sign in with your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
            {/* Email / Phone */}
            <div className="grid gap-2">
              <Label htmlFor="emailOrPhone">Email</Label>
              <Input
                id="emailOrPhone"
                placeholder="you@example.com"
                {...register("emailOrPhone", {
                  required: "Email",
                })}
              />
              {errors.emailOrPhone && (
                <p className="text-sm text-red-600">
                  {errors.emailOrPhone.message}
                </p>
              )}
            </div>

            {/* Password with toggle */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Min 8 characters" },
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

            {/* Server error */}
            {serverError && (
              <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                {serverError}
              </div>
            )}

            <Link
              className="flex items-center gap-1 text-xs text-gray-400 hover:underline hover:text-white"
              to="/"
            >
              <MoveLeft className="w-4 h-4" /> Back to Home
            </Link>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold cursor-pointer"
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            New here?{" "}
            <Link
              to="/register"
              className="font-medium text-pink-600 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
