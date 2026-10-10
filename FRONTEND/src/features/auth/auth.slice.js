import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: true,
        authChecked: false,
    },
    reducers: {
        setUser : (state, action) => {
            state.user = action.payload;
        },
        setLoading : (state, action) => {
            state.loading = action.payload;
        },
        setAuthChecked : (state, action) => {
            state.authChecked = action.payload;
        }
    }
});



export const { setUser, setLoading, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;