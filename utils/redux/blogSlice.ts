import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BlogPost } from '@/types'

interface BlogState {
    blogs: BlogPost[]
    currentBlog: BlogPost | null
    loading: boolean
    error: string | null
}

const initialState: BlogState = {
    blogs: [],
    currentBlog: null,
    loading: false,
    error: null,
}

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
    },
})

export const { setError } = blogSlice.actions
export default blogSlice.reducer
