import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [accept, setAccept] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/auth/register with { username, email, password }
    console.log({ ...form, accept });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-400 tracking-wide">Join the crew</p>
          <h1 className="text-3xl font-semibold text-white">Create account</h1>
          <p className="text-xs text-slate-500">Start chatting with a new profile</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/50 p-6 space-y-5"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
              placeholder="cool_handle"
              required
            />
          </div>

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

          <div className="flex items-start gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
              required
            />
            <span>
              I agree to the <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium">Terms</a> and
              <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium"> Privacy Policy</a>.
            </span>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Already have an account? {" "}
          <a href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
