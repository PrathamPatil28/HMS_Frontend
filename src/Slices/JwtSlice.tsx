import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const token = sessionStorage.getItem("token");

const jwtSlice = createSlice({
    name: "jwt",
    initialState: token || "",
    reducers: {
        setJwt: (_state, action: PayloadAction<string>) => {
            const token = action.payload;
            sessionStorage.setItem("token", token);
            return token;
        },
        removeJwt: () => {
            sessionStorage.removeItem("token");
            return "";
        },
    },
});

// ✅ Export actions
export const { setJwt, removeJwt } = jwtSlice.actions;

// ✅ Export reducer
export default jwtSlice.reducer;
