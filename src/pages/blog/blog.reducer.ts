import { createAction, createAsyncThunk, createReducer, createSlice, nanoid } from '@reduxjs/toolkit'
import { Post } from 'types/blog.type'
import { initialPostList } from 'constants/blog'
import http from 'ultis/http'

interface BlogState {
    postList: Post[]
    editingPost: Post | null
}

const initialState: BlogState = {
    postList: [],
    editingPost: null
}

export const getPostList = createAsyncThunk('blog/getPostList', async (_, thunkAPI) => {
    const response = await http.get<Post[]>('/posts', {
        signal: thunkAPI.signal
    })
    return response.data
})

export const addPost = createAsyncThunk('blog/addPost', async (post: Omit<Post, 'id'>, thunkAPI) => {
    const response = await http.post<Post>('/posts', post)
    return response.data
})

export const updatePost = createAsyncThunk('blog/updatePost', async (post: Post, thunkAPI) => {
    const response = await http.put<Post>(`/posts/${post.id}`, post)
    return response.data
})

export const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        deletePost: (state, action) => {
            const id = action.payload
            const foundPostIndex = state.postList.findIndex((post) => post.id === id)
            if (foundPostIndex !== -1) {
                state.postList.splice(foundPostIndex, 1)
            }
        },
        startEditingPost: (state, action) => {
            const id = action.payload
            const foundPost = state.postList.find((post) => post.id === id) || null
            state.editingPost = foundPost
        },
        cancelEditingPost: (state) => {
            state.editingPost = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPostList.fulfilled, (state, action) => {
                state.postList = action.payload
            })
            .addCase(getPostList.rejected, (state, action) => {
                if (action.error.name === 'AbortError') return
                alert('getPostList rejected')
                console.log('getPostList rejected', action.error)
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.postList.push(action.payload)
            })
            .addCase(addPost.rejected, (state, action) => {
                alert('addPost rejected')
                console.log('addPost rejected', action.error)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                const postId = action.payload.id
                const foundPostIndex = state.postList.findIndex((post) => post.id === postId)
                if (foundPostIndex !== -1) {
                    state.postList[foundPostIndex] = action.payload
                }
                state.editingPost = null
            })
            .addCase(updatePost.rejected, (state, action) => {
                alert('updatePost rejected')
                console.log('updatePost rejected', action.error)
            })
    }
})

export const { deletePost, startEditingPost, cancelEditingPost } = blogSlice.actions
export default blogSlice.reducer
