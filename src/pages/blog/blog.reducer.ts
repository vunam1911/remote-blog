import { createAction, createReducer, createSlice, nanoid } from '@reduxjs/toolkit'
import { Post } from 'types/blog.type'
import { initialPostList } from 'constants/blog'

interface BlogState {
    postList: Post[]
    editingPost: Post | null
}

const initialState: BlogState = {
    postList: [],
    editingPost: null
}

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.postList.push(action.payload)
        },
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
        },
        finishEditingPost: (state, action) => {
            const postId = action.payload.id
            const foundPostIndex = state.postList.findIndex((post) => post.id === postId)
            if (foundPostIndex !== -1) {
                state.postList[foundPostIndex] = action.payload
            }
            state.editingPost = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase('blog/getPostListSuccess', (state, action: any) => {
            state.postList = action.payload
        })
    }
})

export const { addPost, deletePost, startEditingPost, cancelEditingPost, finishEditingPost } = blogSlice.actions
export default blogSlice.reducer
