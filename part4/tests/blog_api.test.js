const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const User = require('../models/user');
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});
describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 100000);
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
});
describe('viewing a specific blog', () => {
  test('a specific blog can be viewed by id', async () => {
    const blogsAtStart = await helper.blogInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultBlog).toBeDefined();
  });
});
describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    };

    await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });

  test('a valid blog without likes property will return 0', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    };
    await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const totalLikes = blogsAtEnd.map((blog) => blog.likes);
    expect(totalLikes).toContain(0);
  });

  test('a valid blog must have a title property', async () => {
    const newBlog = {
      author: 'Mitchell Taylor',
      url: 'https://taylorpatterns.com/',
    };
    await api.post('/api/blogs/').send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('a valid blog must have an url property', async () => {
    const newBlog = {
      title: 'JavaScript',
      author: 'Midu Dev',
    };
    await api.post('/api/blogs/').send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});
describe('deletion of a blog', () => {
  test('succeeds with status code 204 deleted', async () => {
    const blogsAtStart = await helper.blogInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});
describe('updating a blog', () => {
  test('updating a specific blog', async () => {
    const blogsAtStart = await helper.blogInDb();
    const blogToUpdate = blogsAtStart[0];

    const newBlog = {
      title: blogsAtStart[0].title,
      author: blogsAtStart[0].author,
      url: blogsAtStart[0].url,
      likes: blogsAtStart[0].likes,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const likesBeforeUpdate = blogsAtStart.map((blog) => blog.likes);
    const likesAfterUpdate = blogsAtEnd.map((blog) => blog.likes);
    expect(likesAfterUpdate).not.toContain(likesBeforeUpdate);
  });
});

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
});
test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: 'yuco20',
    name: 'Gigi Mora',
    password: 'salainen',
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

  const usernames = usersAtEnd.map((user) => user.username);
  expect(usernames).toContain(newUser.username);
});

afterAll(async () => {
  await mongoose.connection.close();
});
