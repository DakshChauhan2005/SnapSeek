import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [accept, setAccept] = useState(false);
    const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, accept };
    const isRegistered = await handleRegister(payload);
    if (isRegistered) {
      navigate("/verify-email");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f4ef] px-4 py-10 text-[#20211f] sm:py-14">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#747a70]">Join the crew</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">Create account</h1>
          <p className="text-sm text-[#7d837a]">Start chatting with a new profile</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-[#deded6] bg-white p-6 shadow-[0_8px_25px_rgba(32,33,31,0.06)]"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#41453f]" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#deded6] bg-[#f8f8f4] px-4 py-3 text-[#20211f] placeholder:text-[#a0a49d] outline-none transition focus:border-[#a9bca5] focus:ring-2 focus:ring-[#c7d6c1]"
              placeholder="cool_handle"
              required
            />
          </div>

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

          <div className="flex items-start gap-2 text-sm text-[#7d837a]">
            <input
              type="checkbox"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#cdd1c8] bg-[#f8f8f4] text-[#436448] focus:ring-[#a9bca5]"
              required
            />
            <span>
              I agree to the <a href="#" className="font-medium text-[#436448] hover:text-[#385039]">Terms</a> and
              <a href="#" className="font-medium text-[#436448] hover:text-[#385039]"> Privacy Policy</a>.
            </span>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#20211f] px-4 py-3 text-sm font-semibold text-[#f8f8f4] shadow-[0_6px_14px_rgba(32,33,31,0.16)] transition hover:bg-[#3b3d38] focus:ring-2 focus:ring-[#a9bca5] focus:ring-offset-2 focus:ring-offset-[#f5f4ef]"
          >
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-[#7d837a]">
          Already have an account? {" "}
          <a href="/login" className="font-medium text-[#436448] hover:text-[#385039]">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
