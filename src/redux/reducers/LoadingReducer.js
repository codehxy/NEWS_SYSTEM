import { createSlice } from "@reduxjs/toolkit";



const LoadingSlice = createSlice({
    name: "loading",
    initialState: {
        isLoading: false
    },
    reducers: {
        changeLoading: state => {
            state.isLoading = !state.isLoading;
        }
    }
})

export const { changeLoading } = LoadingSlice.actions
export default LoadingSlice.reducer