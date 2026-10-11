import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router'

// Only for logged-in users. Waits for the initial /get-me check before deciding.
const Protected = ({ children }) => {
    const user = useSelector((state) => state.auth.user)
    const authChecked = useSelector((state) => state.auth.authChecked)
    const location = useLocation()

    if (!authChecked) {
        return (
            <main className="flex min-h-dvh items-center justify-center bg-[#f5f4ef] px-6 text-[#20211f]" role="status" aria-live="polite">
                <div className="flex w-full max-w-xs flex-col items-center rounded-[28px] border border-[#deded6] bg-[#f8f8f4] px-8 py-9 text-center shadow-[0_20px_50px_rgba(32,33,31,0.08)]">
                    <div className="relative flex h-20 w-20 items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-[#dfe8da]" />
                        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#436448] border-r-[#9db497]" />
                        <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#20211f] text-lg font-semibold text-[#f5f4ef]">S</span>
                    </div>
                    <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-[#747a70]">SnapSeek</p>
                    <h1 className="mt-2 text-lg font-semibold tracking-[-0.03em]">Preparing your workspace</h1>
                    <p className="mt-2 text-sm leading-6 text-[#687066]">Checking your session securely</p>
                    <div className="mt-6 flex items-center gap-1.5" aria-hidden="true">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#436448]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#709070] [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9db497] [animation-delay:300ms]" />
                    </div>
                </div>
            </main>
        )
    }
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }
    return children
}

export default Protected
