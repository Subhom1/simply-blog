import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BlogPost } from '@/types'

interface BlogState {
    blogs: BlogPost[]
    currentBlog: BlogPost | null
    loading: boolean
    error: string | null
    pagination: {
        currentPage: number
        totalPages: number
        pageSize: number
        totalCount: number
    }
    viewFilter: 'all' | 'my-posts'
}

const initialState: BlogState = {
    blogs: [],
    currentBlog: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 0,
        pageSize: 6,
        totalCount: 0
    },
    viewFilter: 'all'
}

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        addBlog: (state, action: PayloadAction<BlogPost>) => {
            state.blogs.unshift(action.payload)
            state.pagination.totalCount += 1
            state.pagination.totalPages = Math.ceil(state.pagination.totalCount / state.pagination.pageSize)
        },
        updateBlog: (state, action: PayloadAction<BlogPost>) => {
            const index = state.blogs.findIndex(b => b.id === action.payload.id)
            if (index !== -1) {
                state.blogs[index] = action.payload
            }
            if (state.currentBlog?.id === action.payload.id) {
                state.currentBlog = action.payload
            }
        },
        deleteBlog: (state, action: PayloadAction<string>) => {
            state.blogs = state.blogs.filter(b => b.id !== action.payload)
            state.pagination.totalCount -= 1
            state.pagination.totalPages = Math.ceil(state.pagination.totalCount / state.pagination.pageSize)
            if (state.currentBlog?.id === action.payload) {
                state.currentBlog = null
            }
        },
        setBlogs: (state, action: PayloadAction<{ blogs: BlogPost[], totalCount: number }>) => {
            state.blogs = action.payload.blogs
            state.pagination.totalCount = action.payload.totalCount
            state.pagination.totalPages = Math.ceil(action.payload.totalCount / state.pagination.pageSize)
            state.loading = false
        },
        setCurrentBlog: (state, action: PayloadAction<BlogPost | null>) => {
            state.currentBlog = action.payload
            state.loading = false
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.pagination.currentPage = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
            state.loading = false
        },
        setViewFilter: (state, action: PayloadAction<'all' | 'my-posts'>) => {
            state.viewFilter = action.payload
            state.pagination.currentPage = 1
        },
    },
})

export const { addBlog, updateBlog, deleteBlog, setBlogs, setCurrentBlog, setCurrentPage, setLoading, setError, setViewFilter } = blogSlice.actions
export default blogSlice.reducer
