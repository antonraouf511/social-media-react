import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type loginSchemaType } from "../../schemas/auth.schema";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Helmet } from 'react-helmet';
import { ArrowRight, Lock, Mail, Activity } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserLogin } = useContext(AuthContext);

  const Form = useForm<loginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState: { errors } } = Form;

  function handleLogin(value: loginSchemaType) {
    setIsLoading(true);
    setApiError(null);

    axios
      .post(`https://route-posts.routemisr.com/users/signin`, value)
      .then((res) => {
        if (res.data.message) {
          localStorage.setItem("userToken", res.data.data.token);
          setUserLogin(res.data.data.token);
          navigate("/");
        }
      })
      .catch((err) => {
        setApiError(err?.response?.data?.message ?? err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <Helmet>
        <title>Sign In — pulse</title>
        <meta name="description" content="Sign in to your account." />
      </Helmet>

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
        {/* Left Side: Dark Minimalist Showcase matching the aesthetic */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-slate-950 text-white overflow-hidden border-r border-slate-800">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none"></div>

          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-950 flex items-center justify-center font-black shadow-md">
              <Activity size={22} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">pulse</span>
          </div>

          {/* Center Content */}
          <div className="relative z-10 max-w-lg my-auto py-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 mb-6 shadow-sm">
              <Activity size={14} className="text-white" /> Welcome back to Pulse
            </div>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight text-white mb-6">
              Connect with people that matter most.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Share your daily moments, spark meaningful conversations, and stay close with friends and creators around the world in a clean, distraction-free space.
            </p>

            <div className="flex flex-wrap gap-2.5">
              <span className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                📸 Moments &amp; Photos
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                💬 Live Discussions
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                🔒 Secure &amp; Private
              </span>
            </div>
          </div>

          {/* Bottom Stats Footer */}
          <div className="relative z-10 flex items-center gap-12 pt-6 border-t border-slate-900">
            <div>
              <div className="text-2xl font-black text-white">2.4M+</div>
              <div className="text-xs text-slate-400 mt-0.5">Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">99.9%</div>
              <div className="text-xs text-slate-400 mt-0.5">Reliability</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">4.9 ★</div>
              <div className="text-xs text-slate-400 mt-0.5">User Rating</div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form with clean monochrome palette */}
        <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-md">
            {/* Mobile Header Logo */}
            <div className="flex items-center gap-2 lg:hidden mb-8">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-md">
                <Activity size={18} />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">pulse</span>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Sign in to Pulse</h2>
              <p className="text-sm text-slate-500 mt-1.5">Welcome back. Please enter your details.</p>
            </div>

            {apiError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </span>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-3 focus:ring-slate-900/10 focus:bg-white transition-all"
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    {...register("password")}
                    type="password"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-3 focus:ring-slate-900/10 focus:bg-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>
                )}
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full mt-3 py-4 px-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a88 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <>
                    Continue <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center pt-6 border-t border-slate-100 mt-6">
                <p className="text-sm text-slate-500">
                  No account?{" "}
                  <Link to="/register" className="font-bold text-slate-900 hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
