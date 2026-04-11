import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";


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
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <p className="text-sm text-slate-400 tracking-wide">Welcome back</p>
                    <h1 className="text-3xl font-semibold text-white">Sign in</h1>
                    <p className="text-xs text-slate-500">Use your account to access the chat app</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/50 p-6 space-y-5"
                >
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
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
                        className="w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        Sign in
                    </button>
                </form>

                <p className="text-center text-sm text-slate-400">
                    Don&apos;t have an account? {" "}
                    <a href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                        Create one
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
