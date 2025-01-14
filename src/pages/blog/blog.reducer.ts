import { createAction, createReducer, nanoid } from '@reduxjs/toolkit'
import { Post } from 'types/blog.type'
import { initialPostList } from 'constants/blog'

interface BlogState {
    postList: Post[]
    editingPost: Post | null
}

const initialState: BlogState = {
    postList: initialPostList,
    editingPost: null
}

export const addPost = createAction('blog/addPost', function (post: Omit<Post, 'id'>) {
    return { payload: { ...post, id: nanoid() } }
})
export const deletePost = createAction<string>('blog/deletePost')
export const startEditingPost = createAction<string>('blog/startEditingPost')
export const cancelEditingPost = createAction('blog/cancelEditingPost')
export const finishEditingPost = createAction<Post>('blog/finishEditingPost')

const blogReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(addPost, (state, action) => {
            state.postList.push(action.payload)
        })
        .addCase(deletePost, (state, action) => {
            const id = action.payload
            const foundPostIndex = state.postList.findIndex((post) => post.id === id)
            if (foundPostIndex !== -1) {
                state.postList.splice(foundPostIndex, 1)
            }
        })
        .addCase(startEditingPost, (state, action) => {
            const id = action.payload
            const foundPost = state.postList.find((post) => post.id === id) || null
            state.editingPost = foundPost
        })
        .addCase(cancelEditingPost, (state) => {
            state.editingPost = null
        })
        .addCase(finishEditingPost, (state, action) => {
            const postId = action.payload.id
            const foundPostIndex = state.postList.findIndex((post) => post.id === postId)
            if (foundPostIndex !== -1) {
                state.postList[foundPostIndex] = action.payload
            }
            state.editingPost = null
        })
})

export default blogReducer
