import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useSelector } from "react-redux";

const BRAND_VISITED_KEY = "snapseek-brand-page-seen";

const BrandPage = () => {
    const { user, loading } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [isFirstVisit] = useState(() => window.localStorage.getItem(BRAND_VISITED_KEY) !== "true");

    useEffect(() => {
        if (!loading && !user && isFirstVisit) {
            window.localStorage.setItem(BRAND_VISITED_KEY, "true");
        }
    }, [isFirstVisit, loading, user]);

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-[#f5f4ef] text-sm text-[#747a70]">Loading SnapSeek...</div>;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    if (!isFirstVisit) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="min-h-screen overflow-hidden bg-[#f5f4ef] text-[#20211f]">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-14">
                <header className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3" aria-label="SnapSeek home">
                        <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#20211f] text-lg font-semibold text-[#f5f4ef]">S</span>
                        <span className="text-lg font-semibold tracking-[-0.04em]">SnapSeek</span>
                    </Link>
                    <Link to="/login" className="text-sm font-semibold text-[#436448] transition hover:text-[#20211f]">
                        Sign in
                    </Link>
                </header>

                <section className="grid flex-1 items-center gap-14 py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.75fr)] lg:gap-20 lg:py-8">
                    <div className="max-w-2xl">
                        <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#747a70]">A clearer way to think</p>
                        <h1 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-7xl">
                            Your ideas, in focus.
                        </h1>
                        <p className="mt-7 max-w-lg text-lg leading-8 text-[#687066]">
                            SnapSeek is a calm AI workspace for asking better questions, exploring the web, and keeping every useful conversation close at hand.
                        </p>
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center rounded-xl bg-[#20211f] px-6 py-3.5 text-sm font-semibold text-[#f8f8f4] shadow-[0_8px_18px_rgba(32,33,31,0.15)] transition hover:bg-[#3b3d38]"
                            >
                                Start exploring <span className="ml-3 text-base">-&gt;</span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-[#436448] transition hover:bg-[#e8ebe2]"
                            >
                                I already have an account
                            </button>
                        </div>
                        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-xs font-medium uppercase tracking-[0.12em] text-[#8a9087]">
                            <span>Private by design</span>
                            <span>Search when it matters</span>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[500px] lg:mr-0">
                        <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[#d8e2d1] opacity-80" />
                        <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-[#e5d9bf] opacity-70" />
                        <div className="relative rounded-[28px] border border-[#d8d9cf] bg-[#20211f] p-3 shadow-[0_24px_60px_rgba(32,33,31,0.18)]">
                            <div className="rounded-[20px] bg-[#f8f8f4] p-5 sm:p-7">
                                <div className="flex items-center justify-between border-b border-[#deded6] pb-5">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a9087]">New conversation</p>
                                        <p className="mt-1 text-sm font-semibold">Find the signal</p>
                                    </div>
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#9db497]" />
                                </div>
                                <div className="space-y-5 py-7">
                                    <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-[#dfe8da] px-4 py-3 text-sm leading-6 text-[#3c513f]">
                                        Help me make sense of this idea.
                                    </div>
                                    <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-6 text-[#596057] shadow-[0_5px_15px_rgba(32,33,31,0.05)]">
                                        Let&apos;s find the useful thread, then build from there.
                                    </div>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-[#deded6] bg-white px-4 py-3 text-sm text-[#a0a49d]">
                                    <span>Ask anything...</span>
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#20211f] text-xs text-white">-&gt;</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default BrandPage;
