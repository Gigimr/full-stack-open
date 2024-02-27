import { useState } from 'react';

const BlogFom = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleAuthor = (e) => {
    setAuthor(e.target.value);
  };
  const handleUrl = (e) => {
    setUrl(e.target.value);
  };

  const addBlog = (e) => {
    e.preventDefault();

    createBlog({
      title: title,
      author: author,
      url: url,
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h1>create a new</h1>
      <form onSubmit={addBlog}>
        title:
        <input value={title} onChange={handleTitle} />
        <br />
        author:
        <input value={author} onChange={handleAuthor} />
        <br />
        url:
        <input value={url} onChange={handleUrl} />
        <br />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogFom;
