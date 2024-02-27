import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import claases from './test.module.css';
import loginService from './services/login';
import BlogFom from './components/BlogForm';
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
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
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
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));

      blogService.setToken(user.token);
      console.log('User logged in', user);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = () => {
    console.log('Cerrando sesión');
    window.localStorage.clear();
    window.location.href = 'http://localhost:5173/';
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

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
          {loginForm()}
        </div>
      ) : (
        <div className={claases.test}>
          <h1>Blogs</h1>
          {notificationInfo && (
            <Notification notificationInfo={notificationInfo} />
          )}

          <p>
            {user.name} logged in <button onClick={handleLogOut}>logout</button>
          </p>
          <BlogFom createBlog={addBlog} />

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
