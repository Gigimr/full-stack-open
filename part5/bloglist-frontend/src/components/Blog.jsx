const Blog = ({ blog, showInfo, showMore }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
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
        </div>
      )}
    </div>
  );
};

export default Blog;
