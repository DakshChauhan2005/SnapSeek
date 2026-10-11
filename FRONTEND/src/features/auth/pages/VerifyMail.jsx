import { Link, useLocation, useSearchParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { verifyEmail, resendVerification } from "../services/auth.api";

const VerifyMail = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [status, setStatus] = useState("waiting");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [resendMsg, setResendMsg] = useState("");
  const [resending, setResending] = useState(false);
  const hasVerified = useRef(false); 

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("waiting");
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;

    setStatus("verifying");
    verifyEmail(token)
      .then((response) => {
        setStatus("success");
        setMessage(response.message || "Your email has been verified successfully.");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error.response?.data?.message || "This verification link is invalid or has expired.");
      });
  }, [searchParams]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setResending(true);
    setResendMsg("");
    try {
      const res = await resendVerification(email.trim());
      setResendMsg(res.message);
    } catch (error) {
      setResendMsg(error.response?.data?.message || "Could not resend the link. Please try again.");
    } finally {
      setResending(false);
    }
  };
  const isVerifying = status === "verifying";
  const isSuccess = status === "success";
  const isWaiting = status === "waiting";

  return (
    <main className="min-h-dvh bg-[#f5f4ef] text-[#20211f]">
      <div className="flex min-h-dvh w-full flex-col lg:flex-row">
        <aside className="flex w-full flex-col border-b border-[#deded6] bg-[#e9ebe5] px-5 pb-5 pt-[max(1.5rem,env(safe-area-inset-top))] lg:w-[310px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-7 lg:pb-8 lg:pt-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#747a70]">SnapSeek</p>
            <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Your workspace</h1>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl lg:mt-10 border border-[#d4d7cf] bg-[#f1f2ed] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d8dbd4] text-[#747a70]">&#128274;</div>
            <div>
              <p className="text-sm font-semibold text-[#596057]">Workspace locked</p>
              <p className="mt-0.5 text-xs text-[#899087]">Verification required</p>
            </div>
          </div>

          <div className="mt-auto hidden border-t border-[#d4d7cf] pt-5 lg:block">
            <p className="text-xs leading-5 text-[#7d837a]">Your conversations and saved ideas will be ready as soon as your account is verified.</p>
          </div>
        </aside>

        <section className="flex flex-1 flex-col bg-[#f8f8f4]">
          <header className="flex items-center justify-between border-b border-[#e4e4dc] px-5 py-4 sm:px-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#899087]">Account setup</p>
              <h2 className="mt-1 text-base font-semibold">Almost there</h2>
            </div>
            <span className="rounded-full border border-[#cddbc9] bg-[#eaf1e7] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#436448]">Step 1 of 1</span>
          </header>

          <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-10 sm:py-12">
            <div className="w-full max-w-xl rounded-2xl border border-[#deded6] bg-white p-5 shadow-[0_12px_35px_rgba(32,33,31,0.07)] sm:p-10">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${isSuccess || isWaiting ? "bg-[#dce8d8] text-[#436448]" : status === "error" ? "bg-[#f3e2dc] text-[#a34e3b]" : "bg-[#dce8d8] text-[#436448]"}`} aria-hidden="true">
                {isVerifying ? "..." : isSuccess ? "✓" : isWaiting ? "✉" : "!"}
              </div>

              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] sm:mt-8 text-[#747a70]">{isVerifying ? "Confirming account" : isSuccess ? "Account ready" : isWaiting ? "Check your inbox" : "Verification issue"}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.045em] sm:text-4xl">{isVerifying ? "Verifying your email" : isSuccess ? "Email verified" : isWaiting ? "Check your email" : "We could not verify that link"}</h3>
              <p className="mt-4 max-w-md text-sm leading-6 text-[#697067]">{isVerifying ? "We are confirming your email address. This will only take a moment." : isWaiting ? "We sent a verification link to your inbox. Open it to unlock your SnapSeek workspace and start your first conversation." : message}</p>

              {!isVerifying && !isWaiting && (
                <div className={`mt-8 flex items-start gap-3 rounded-xl border p-4 ${isSuccess ? "border-[#dfe8dc] bg-[#f3f7f1]" : "border-[#ead8d2] bg-[#fbf1ee]"}`}>
                  <span className={`mt-0.5 ${isSuccess ? "text-[#436448]" : "text-[#a34e3b]"}`} aria-hidden="true">{isSuccess ? "✓" : "!"}</span>
                  <p className="text-sm leading-5 text-[#596057]">{isSuccess ? "Your account is unlocked. Sign in to start using SnapSeek." : "Request a new registration if you no longer have a valid verification link."}</p>
                </div>
              )}
              {!isVerifying && !isSuccess && (
                <form onSubmit={handleResend} className="mt-8 space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#747a70]" htmlFor="resend-email">Didn't get it? Resend the link</label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="resend-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full min-w-0 rounded-xl border border-[#deded6] bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#a9bca5]"
                    />
                    <button
                      type="submit"
                      disabled={resending}
                      className="rounded-xl border border-[#20211f] px-5 py-3 text-sm font-semibold transition hover:bg-[#20211f] hover:text-[#f8f8f4] disabled:opacity-60"
                    >
                      {resending ? "Sending..." : "Resend"}
                    </button>
                  </div>
                  {resendMsg && <p className="text-xs leading-5 text-[#596057]">{resendMsg}</p>}
                </form>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/login" className="inline-flex items-center justify-center rounded-xl bg-[#20211f] px-5 py-3 text-sm font-semibold text-[#f8f8f4] transition hover:bg-[#3b3d38] focus:outline-none focus:ring-2 focus:ring-[#a9bca5] focus:ring-offset-2">
                  {isSuccess ? "Continue to sign in" : "Return to sign in"}
                </Link>
                <p className="text-xs leading-5 text-[#899087]">{isVerifying ? "Please keep this page open." : isWaiting ? "The link may take a moment to arrive." : "Already verified? Sign in to continue."}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default VerifyMail;