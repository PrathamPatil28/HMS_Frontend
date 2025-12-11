import { configureStore } from "@reduxjs/toolkit";
import jwtReducer from '../Slices/JwtSlice'; // Adjust the path as needed
import  userReducer  from "../Slices/UserSlice";
import  notificationReducer from "../Slices/NotificationSlice"


export default configureStore({
    reducer : {
        jwt : jwtReducer,
        user : userReducer,
        notifications: notificationReducer

    }
})