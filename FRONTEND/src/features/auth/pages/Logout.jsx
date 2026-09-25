import {useAuth} from "../hook/useAuth";
import {useEffect} from "react";

const Logout = () => {
    const { handleLogout } = useAuth();
    const logoutUser = async () => {
        await handleLogout();
    }
    logoutUser();


    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f5f4ef] px-4 py-10 text-[#20211f] sm:py-14">
            <div className="mx-auto w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#747a70]">Logging out</p>
                    <h1 className="text-3xl font-semibold tracking-[-0.04em]">You are being logged out</h1>
                    <p className="text-sm text-[#7d837a]">Please wait while we log you out of the chat app</p>
                </div>
            </div>
        </div>
    )
}

export default Logout;