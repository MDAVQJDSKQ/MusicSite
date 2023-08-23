function BlogPost(props) {
    return (
        <div className="blog-post">
            <h2>{props.title}</h2>
            <p>{props.excerpt}</p>
            <a href={`#post-${props.id}`}>Read More</a>
        </div>
    );
}

export default BlogPost;