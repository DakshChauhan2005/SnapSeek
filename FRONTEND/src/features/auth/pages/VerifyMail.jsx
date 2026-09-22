
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { verifyEmail } from "../services/auth.api";
import { setUser } from "../auth.slice";

const VerifyMail = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = useState("waiting");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("waiting");
      return;
    }

    setStatus("verifying");
    verifyEmail(token)
      .then((response) => {
        dispatch(setUser(response.user));
        setStatus("success");
        setMessage(response.message || "Your email has been verified successfully.");
        navigate("/", { replace: true });
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error.response?.data?.message || "This verification link is invalid or has expired.");
      });
  }, [dispatch, navigate, searchParams]);

  const isVerifying = status === "verifying";
  const isSuccess = status === "success";
  const isWaiting = status === "waiting";

  return (
    <main className="min-h-screen bg-[#f5f4ef] text-[#20211f]">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <aside className="flex w-full flex-col border-b border-[#deded6] bg-[#e9ebe5] px-5 py-6 lg:w-[310px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-7 lg:py-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#747a70]">SnapSeek</p>
            <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Your workspace</h1>
          </div>

          <div className="mt-10 flex items-center gap-3 rounded-xl border border-[#d4d7cf] bg-[#f1f2ed] p-3">
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

        <section className="flex min-h-[calc(100vh-155px)] flex-1 flex-col bg-[#f8f8f4] lg:min-h-screen">
          <header className="flex items-center justify-between border-b border-[#e4e4dc] px-5 py-4 sm:px-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#899087]">Account setup</p>
              <h2 className="mt-1 text-base font-semibold">Almost there</h2>
            </div>
            <span className="rounded-full border border-[#cddbc9] bg-[#eaf1e7] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#436448]">Step 1 of 1</span>
          </header>

          <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
            <div className="w-full max-w-xl rounded-2xl border border-[#deded6] bg-white p-6 shadow-[0_12px_35px_rgba(32,33,31,0.07)] sm:p-10">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${isSuccess || isWaiting ? "bg-[#dce8d8] text-[#436448]" : status === "error" ? "bg-[#f3e2dc] text-[#a34e3b]" : "bg-[#dce8d8] text-[#436448]"}`} aria-hidden="true">
                {isVerifying ? "..." : isSuccess ? "✓" : isWaiting ? "✉" : "!"}
              </div>

              <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.22em] text-[#747a70]">{isVerifying ? "Confirming account" : isSuccess ? "Account ready" : isWaiting ? "Check your inbox" : "Verification issue"}</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{isVerifying ? "Verifying your email" : isSuccess ? "Email verified" : isWaiting ? "Check your email" : "We could not verify that link"}</h3>
              <p className="mt-4 max-w-md text-sm leading-6 text-[#697067]">{isVerifying ? "We are confirming your email address. This will only take a moment." : isWaiting ? "We sent a verification link to your inbox. Open it to unlock your SnapSeek workspace and start your first conversation." : message}</p>

              {!isVerifying && !isWaiting && (
                <div className={`mt-8 flex items-start gap-3 rounded-xl border p-4 ${isSuccess ? "border-[#dfe8dc] bg-[#f3f7f1]" : "border-[#ead8d2] bg-[#fbf1ee]"}`}>
                  <span className={`mt-0.5 ${isSuccess ? "text-[#436448]" : "text-[#a34e3b]"}`} aria-hidden="true">{isSuccess ? "✓" : "!"}</span>
                  <p className="text-sm leading-5 text-[#596057]">{isSuccess ? "Your account is unlocked. Sign in to start using SnapSeek." : "Request a new registration if you no longer have a valid verification link."}</p>
                </div>
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