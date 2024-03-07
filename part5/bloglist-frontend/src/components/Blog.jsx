import { useState } from 'react';
const Blog = ({
  blog,
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
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
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
    <div style={blogStyle}className="blog">
      <div style={hideWhenVisible} className='unvisible'>
        {blog.title} {blog.author}
        <button onClick=
          {toggleVisibility}>
          view
        </button>
      </div>
      <div style={showWhenVisible}>
        <div>
          {blog.url}
          <br/>
          {blog.likes}
          <button onClick={toggleVisibility}>hide</button>
        </div>
        <button onClick={handleLikes}>like</button>
        {blog.user && <div>{blog.user.username}</div>}
        {blog.user &&
            loggedInUser &&
            blog.user.username === loggedInUser.username && (
          <button onClick={confirmDelete}>remove</button>
        )}
      </div>

    </div>
  );
};

export default Blog;
