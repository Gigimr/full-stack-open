const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

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

test('a specific blog can be viewed by id', async () => {
  const blogsAtStart = await helper.blogInDb();
  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(resultBlog).toBeDefined();
});

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

afterAll(async () => {
  await mongoose.connection.close();
});
