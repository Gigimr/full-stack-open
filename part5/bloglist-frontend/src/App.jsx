import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import claases from './test.module.css';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';

import Notification from './components/Notification';
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notificationInfo, setNotificationInfo] = useState(null);

  useEffect(() => {
    if (user?.token) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      blogService.setToken(user.token);
      console.log('User logged in', user);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (error) {
      if (error.response.data.error === 'invalid username or password') {
        setNotificationInfo({
          type: 'error',
          message: 'wrong username or password',
        });
        setTimeout(() => setNotificationInfo(null), 7000);
      }
    }
  };

  const handleLogOut = () => {
    console.log('Cerrando sesión');
    window.localStorage.clear();
    window.location.href = 'http://localhost:5173/';
  };

  const addBlog = (createBlog) => {
    blogService.create(createBlog).then((response) => {
      setBlogs(blogs.concat(response));
      setNotificationInfo({
        type: 'success',
        message: `A new blog ${createBlog.title}  by ${createBlog.author} added`,
      });
      setTimeout(() => setNotificationInfo(null), 7000);
    });
  };

  return (
    <div>
      {user === null ? (
        <div>
          <h1>Log in to application</h1>
          {notificationInfo && (
            <Notification notificationInfo={notificationInfo} />
          )}
          <LoginForm
            username={username}
            password={password}
            handleLogin={handleLogin}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        </div>
      ) : (
        <div className={claases.test}>
          <h1>Blogs</h1>

          <p>
            {user.name} logged in <button onClick={handleLogOut}>logout</button>
          </p>
          <BlogForm createBlog={addBlog} />

          <div>
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;