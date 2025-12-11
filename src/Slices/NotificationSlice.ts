import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string | number; // Ensure ID is defined
  message: string;
  // Add other fields if necessary
}

interface NotificationState {
  list: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  list: [],
  unreadCount: 0
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      // 🔥 FIX: Check if this ID already exists in the list
      const exists = state.list.find((n) => n.id === action.payload.id);

      // Only add if it DOES NOT exist
      if (!exists) {
        state.list.unshift(action.payload);
        state.unreadCount += 1;
      }
    },
    markAllRead: (state) => {
      state.unreadCount = 0;
    }
  }
});

export const { addNotification, markAllRead } = notificationSlice.actions;
export default notificationSlice.reducer;