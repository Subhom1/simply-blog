import { configureStore } from '@reduxjs/toolkit'
import authReducer from './redux/authSlice'
import blogReducer from './redux/blogSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            blog: blogReducer,
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
