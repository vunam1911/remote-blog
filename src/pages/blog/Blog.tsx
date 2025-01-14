import CreatePost from './components/CreatePost'
import PostList from './components/PostList'

export default function Blog() {
    return (
        <div className='p-5'>
            <button
                onClick={() => {
                    throw new Error(`This is your ${process.env.NODE_ENV} FOUTH error!`)
                }}
            >
                Break the world Vu Hai Nam
            </button>
            <CreatePost />
            <PostList />
        </div>
    )
}
