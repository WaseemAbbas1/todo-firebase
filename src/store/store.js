import { configureStore } from "@reduxjs/toolkit";
import product from "./slices/productSlices"
import userStore from "./slices/userSlice"
export const store = configureStore({
    reducer :{
        data: product,
        user : userStore
    }
})