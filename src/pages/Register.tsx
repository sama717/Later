import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import { registerSchema, type RegisterFormValues } from "../lib/authSchemas";
import registerBg from "../assets/register-bg.gif";

function Register() {
  const navigate = useNavigate();
  const { signUpWithPassword, signInWithGoogle, isSubmitting, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    const success = await signUpWithPassword(values.email, values.password, values.name);
    if (success) navigate("/");
  }

  return (
    <AuthLayout backgroundImage={registerBg}>
      <h1 className="text-3xl font-medium text-foreground text-center">Create your account</h1>
      <p className="text-muted-foreground mt-1 text-center">Join LATER and start your backlog</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <label className="block font-medium mb-1.5" htmlFor="name">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            {...register("name")}
            className="w-full h-12 px-4 border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-[5px]"
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1.5" htmlFor="email">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full h-12 px-4 border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-[5px]"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1.5" htmlFor="password">
            Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full h-12 px-4 pr-11 border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-[5px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1.5" htmlFor="confirmPassword">
            Confirm Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter Password"
              {...register("confirmPassword")}
              className="w-full h-12 px-4 pr-11 border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-[5px]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer mt-10"
        >
          {isSubmitting ? "Creating account…" : "Sign Up"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground underline">
            Login
          </Link>
        </p>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full h-12 flex items-center justify-center gap-2 border border-border bg-card font-medium hover:bg-accent transition-colors cursor-pointer rounded-[5px]"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.36 0-4.35-1.6-5.07-3.74H.94v2.33A9 9 0 0 0 9 18z" />
            <path fill="#FBBC05" d="M3.93 10.68A5.4 5.4 0 0 1 3.65 9c0-.58.1-1.15.28-1.68V4.99H.94A9 9 0 0 0 0 9c0 1.45.35 2.83.94 4.01l2.99-2.33z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .94 4.99l2.99 2.33C4.65 5.18 6.64 3.58 9 3.58z" />
          </svg>
          Sign Up with Google
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;