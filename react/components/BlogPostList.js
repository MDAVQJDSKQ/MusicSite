import BlogPost from './BlogPost.';

function BlogPostList(props) {
    return (
        <div className="blog-post-list">
            {props.posts.map(post => (
                <BlogPost key={post.id} {...post} />
            ))}
        </div>
    );
}

export default BlogPostList;