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
        <input
          id='title'
          value={title}
          onChange={handleTitle}
          placeholder='write tittle here'
        />
        <br />
        author:
        <input
          id='author'
          value={author}
          onChange={handleAuthor}
          placeholder='write author here'
        />
        <br />
        url:
        <input
          id='url'
          value={url}
          onChange={handleUrl}
          placeholder='write url here'
        />
        <br />
        <button id = 'createButton'
          type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogFom;
