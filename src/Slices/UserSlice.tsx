import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface UserState extends JwtPayload {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
}

const token = sessionStorage.getItem('token');
let decodedUser: UserState = {};

if (token && typeof token === 'string') {
    try {
        decodedUser = jwtDecode<UserState>(token);
    } catch (e) {
        console.error('Invalid token:', e);
        sessionStorage.removeItem('token');
    }
}

const userSlice = createSlice({
    name: 'user',
    initialState: decodedUser,
    reducers: {
        setUser: (_state, action: PayloadAction<string>) => {
            const token = action.payload;

            if (typeof token !== 'string') {
                console.error('Invalid token type:', token);
                sessionStorage.removeItem('token');
                return {};
            }

            sessionStorage.setItem('token', token);

            try {
                return jwtDecode<UserState>(token);
            } catch (e) {
                console.error('Failed to decode token:', e);
                sessionStorage.removeItem('token');
                return {};
            }
        },
        removeUser: () => {
            sessionStorage.removeItem('token');
            return {};
        },
    },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
