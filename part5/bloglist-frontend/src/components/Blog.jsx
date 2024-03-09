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
      <span id='blogTitle'>{blog.title}</span> - <span id='blogAuthor'>{blog.author}</span>
      <button onClick={toggleVisibility}>{!visible?'view':'hide'}</button>
      {visible &&<>
        <br/>
        <span id='blogUrl'>{blog.url}</span>
        <br/>
        <span id='blogLikes'>{blog.likes}</span>
        <button onClick={handleLikes}>like</button>
        {blog.user && <div>{blog.user.username}</div>}
        {blog.user &&
          loggedInUser &&
          blog.user.username === loggedInUser.username && (
          <button onClick={confirmDelete}>remove</button>
        )}
      </> }
    </div>
  );
};

export default Blog;
