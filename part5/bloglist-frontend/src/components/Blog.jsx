const Blog = ({
  blog,
  showInfo,
  showMore,
  addingLikes,
  deletingBlogs,
  loggedInUser,
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLikes = () => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    };
    addingLikes(blog.id, blogObject);
  };

  const confirmDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deletingBlogs(blog.id);
    }
  };
  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button onClick={() => showInfo(blog.id)}>
          {showMore[blog.id] ? 'hide' : 'view'}
        </button>
      </div>
      {showMore[blog.id] && (
        <div>
          {blog.author}
          <br />
          {blog.url}
          <br />
          {blog.likes}
          <button onClick={handleLikes}>like</button>
          {blog.user && <div>{blog.user.username}</div>}
          {blog.user &&
            loggedInUser &&
            blog.user.username === loggedInUser.username && (
              <button onClick={confirmDelete}>remove</button>
            )}
        </div>
      )}
    </div>
  );
};

export default Blog;
