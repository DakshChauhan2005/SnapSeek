import { useDispatch } from "react-redux";
import { register, login, getMe, logout } from "../services/auth.api";
import { setUser, setLoading, setAuthChecked } from "../auth.slice";
import { notifyError } from "../../../utils/notify";
import { disconnectSocket } from "../../chat/chat.socket";




export function useAuth() {

    const dispatch = useDispatch();

    
    async function handleRegister({ username, email, password }) {
        try {
            dispatch(setLoading(true));
            await register({ username, email, password });
            return true;
        } catch (err) {
            notifyError(err, "Registration failed");
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));
            const data = await login({ email, password });
            dispatch(setUser(data.user));
            return true;
        } catch (err) {
            notifyError(err, "Login failed");
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
         } catch {
+            dispatch(setUser(null));
         } finally {
            dispatch(setLoading(false));
            dispatch(setAuthChecked(true));
        }
    }

    async function handleLogout() {
        try {
            dispatch(setLoading(true));
            await logout();
            dispatch(setUser(null));
        } catch (err) {
            notifyError(err, "Logout failed");
        } finally {
            disconnectSocket();
            dispatch(setLoading(false));
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout
    }
}