import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Post } from 'types/blog.type'
import http from 'ultis/http'

interface BlogState {
    postList: Post[]
    editingPost: Post | null
    isLoading: boolean
    currentRequestId: string | undefined
}

const initialState: BlogState = {
    postList: [],
    editingPost: null,
    isLoading: false,
    currentRequestId: undefined
}

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export const getPostList = createAsyncThunk('blog/getPostList', async (_, thunkAPI) => {
    const response = await http.get<Post[]>('/posts', {
        signal: thunkAPI.signal
    })
    return response.data
})

export const addPost = createAsyncThunk('blog/addPost', async (post: Omit<Post, 'id'>, thunkAPI) => {
    console.log('HEHEH', post)
    const response = await http.post<Post>('/posts', post)
    return response.data
})

export const updatePost = createAsyncThunk('blog/updatePost', async (post: Post, thunkAPI) => {
    const response = await http.put<Post>(`/posts/${post.id}`, post)
    return response.data
})

export const deletePost = createAsyncThunk('blog/deletePost', async (id: string, thunkAPI) => {
    const response = await http.delete<Post>(`/posts/${id}`)
    return response.data
})

export const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
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
                if (action.error.name === 'AbortError') return
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
                if (action.error.name === 'AbortError') return
                alert('updatePost rejected')
                console.log('updatePost rejected', action.error)
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                const id = action.payload.id
                const foundPostIndex = state.postList.findIndex((post) => post.id === id)
                if (foundPostIndex !== -1) {
                    state.postList.splice(foundPostIndex, 1)
                }
            })
            .addCase(deletePost.rejected, (state, action) => {
                if (action.error.name === 'AbortError') return
                alert('deletePost rejected')
                console.log('deletePost rejected', action.error)
            })
            .addMatcher<PendingAction>(
                (action) => action.type.endsWith('/pending'),
                (state, action) => {
                    state.isLoading = true
                    state.currentRequestId = action.meta.requestId
                }
            )
            .addMatcher<FulfilledAction | RejectedAction>(
                (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
                (state, action) => {
                    if (state.isLoading && state.currentRequestId === action.meta.requestId) {
                        state.isLoading = false
                        state.currentRequestId = undefined
                    }
                }
            )
    }
})

export const { startEditingPost, cancelEditingPost } = blogSlice.actions
export default blogSlice.reducer
