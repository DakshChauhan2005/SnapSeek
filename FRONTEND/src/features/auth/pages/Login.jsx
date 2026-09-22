import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";


const Login = () => {
    const { user, loading } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    
    const { handleLogin } = useAuth();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { email: form.email, password: form.password };
        await handleLogin(payload);
        navigate("/")
    };


    if (!loading && user) {
        return <Navigate to="/" />
    } 
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f5f4ef] px-4 py-10 text-[#20211f] sm:py-14">
            <div className="mx-auto w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#747a70]">Welcome back</p>
                    <h1 className="text-3xl font-semibold tracking-[-0.04em]">Sign in</h1>
                    <p className="text-sm text-[#7d837a]">Use your account to access the chat app</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-2xl border border-[#deded6] bg-white p-6 shadow-[0_8px_25px_rgba(32,33,31,0.06)]"
                >
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#41453f]" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#deded6] bg-[#f8f8f4] px-4 py-3 text-[#20211f] placeholder:text-[#a0a49d] outline-none transition focus:border-[#a9bca5] focus:ring-2 focus:ring-[#c7d6c1]"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#41453f]" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#deded6] bg-[#f8f8f4] px-4 py-3 text-[#20211f] placeholder:text-[#a0a49d] outline-none transition focus:border-[#a9bca5] focus:ring-2 focus:ring-[#c7d6c1]"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* <div className="flex items-center justify-between text-sm text-slate-400">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                            />
                            Remember me
                        </label>
                        <button type="button" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Forgot password?
                        </button>
                    </div> */}

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-[#20211f] px-4 py-3 text-sm font-semibold text-[#f8f8f4] shadow-[0_6px_14px_rgba(32,33,31,0.16)] transition hover:bg-[#3b3d38] focus:ring-2 focus:ring-[#a9bca5] focus:ring-offset-2 focus:ring-offset-[#f5f4ef]"
                    >
                        Sign in
                    </button>
                </form>

                <p className="text-center text-sm text-[#7d837a]">
                    Don&apos;t have an account? {" "}
                    <a href="/register" className="font-medium text-[#436448] hover:text-[#385039]">
                        Create one
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
