import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import VerifyMail from "../features/auth/pages/VerifyMail";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import GuestOnly from "../features/auth/components/GuestOnly";
import Logout from "../features/auth/pages/Logout";
import BrandPage from "../features/auth/pages/BrandPage";
import LegalPage from "../features/legal/pages/LegalPage";
export const router = createBrowserRouter([
    {
        path: "/login",
        element: <GuestOnly><Login /></GuestOnly>
    },
    {
        path: "/register",
        element: <GuestOnly><Register /></GuestOnly>
    },
    {
        path: "/verify-email",
        element: <VerifyMail />
    },
    {
        path: "/",
        element: <BrandPage />
    },
    {
        path: "/home",
        element: <BrandPage allowAuthenticated />
    },
    {
        path: "/privacy",
        element: <LegalPage type="privacy" />
    },
    {
        path: "/terms",
        element: <LegalPage type="terms" />
    },
    {
        path: "/dashboard",
        element: <Protected>
            <Dashboard />
        </Protected>
    },
    {
        path: "/logout",
        element: <Protected>
            <Logout/>
        </Protected>
    }
])