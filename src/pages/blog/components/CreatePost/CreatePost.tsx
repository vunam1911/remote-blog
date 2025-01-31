import { unwrapResult } from '@reduxjs/toolkit'
import { addPost, cancelEditingPost, updatePost } from 'pages/blog/blog.reducer'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'store'
import { Post } from 'types/blog.type'

interface ErrorForm {
    publishedDate: string
}

const initialState: Post = {
    id: '',
    title: '',
    publishedDate: '',
    description: '',
    featuredImage: '',
    published: false
}

const CreatePost = () => {
    const dispatch = useAppDispatch()
    const [errorForm, setErrorForm] = useState<null | ErrorForm>(null)
    const [formData, setFormData] = useState<Post>(initialState)
    const { editingPost, isLoading } = useSelector((state: RootState) => ({ ...state.blog }))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (editingPost) {
            dispatch(updatePost(formData))
                .unwrap()
                .then((result) => {
                    setFormData(initialState)
                    if (errorForm) setErrorForm(null)
                })
                .catch((error) => setErrorForm(error.error))
        } else {
            try {
                const { id, ...postWithoutId } = formData
                await dispatch(addPost(postWithoutId)).unwrap()
                setFormData(initialState)
                if (errorForm) setErrorForm(null)
            } catch (error: any) {
                setErrorForm(error.error)
            }
        }
    }

    const handleCancelEditing = () => {
        dispatch(cancelEditingPost())
        setFormData(initialState)
    }

    useEffect(() => {
        if (editingPost) {
            setFormData(editingPost || initialState)
        }
    }, [editingPost])

    return (
        <form onSubmit={handleSubmit}>
            <div className='mb-6'>
                <label htmlFor='title' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Title
                </label>
                <input
                    type='text'
                    id='title'
                    name='title'
                    className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                    placeholder='Title'
                    required
                    value={formData.title}
                    onChange={handleChange}
                />
            </div>
            <div className='mb-6'>
                <label
                    htmlFor='featuredImage'
                    className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'
                >
                    Featured Image
                </label>
                <input
                    type='text'
                    id='featuredImage'
                    name='featuredImage'
                    className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                    placeholder='Url image'
                    required
                    value={formData.featuredImage}
                    onChange={handleChange}
                />
            </div>
            <div className='mb-6'>
                <div>
                    <label
                        htmlFor='description'
                        className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400'
                    >
                        Description
                    </label>
                    <textarea
                        id='description'
                        name='description'
                        rows={3}
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                        placeholder='Your description...'
                        required
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className='mb-6'>
                <label
                    htmlFor='publishedDate'
                    className={`mb-2 block text-sm font-medium dark:text-gray-300 ${
                        errorForm?.publishedDate ? 'text-red-700' : 'text-gray-900'
                    }`}
                >
                    Publish Date
                </label>
                <input
                    type='datetime-local'
                    id='publishedDate'
                    name='publishedDate'
                    className={`block w-56 rounded-lg border p-2.5 text-sm ${
                        errorForm?.publishedDate
                            ? 'border-red-500 bg-red-50 placeholder-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                    }`}
                    placeholder='Title'
                    required
                    value={formData.publishedDate}
                    onChange={handleChange}
                />
                {errorForm?.publishedDate && (
                    <p className='mt-2 text-sm text-red-500'>
                        <span className='font-medium'>Lỗi:</span> {errorForm.publishedDate}
                    </p>
                )}
            </div>
            <div className='mb-6 flex items-center'>
                <input
                    id='published'
                    name='published'
                    type='checkbox'
                    className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
                    checked={formData.published}
                    onChange={(event) => setFormData((prev) => ({ ...prev, published: event.target.checked }))}
                />
                <label htmlFor='published' className='ml-2 text-sm font-medium text-gray-900'>
                    Published
                </label>
            </div>
            <div>
                {!editingPost ? (
                    <button
                        className='group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'
                        type='submit'
                    >
                        <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                            Publish Post
                        </span>
                    </button>
                ) : (
                    <>
                        <button
                            type='submit'
                            className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
                        >
                            <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                                Update Post
                            </span>
                        </button>
                        <button
                            type='reset'
                            className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400'
                            onClick={handleCancelEditing}
                        >
                            <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                                Cancel
                            </span>
                        </button>
                    </>
                )}
            </div>
        </form>
    )
}

export default CreatePost
