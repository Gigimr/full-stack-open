const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const User = require('../models/user');
const Blog = require('../models/blog');

let authHeader;

beforeAll(async () => {
  // Elimina usuarios y blogs antes las pruebas
  await User.deleteMany({});
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);

  // Crear usuario
  const passwordHash = await bcrypt.hash('test123', 10);
  const user = new User({
    username: 'gigi',
    name: 'gigitest',
    blogs: [],
    passwordHash,
  });
  await user.save();

  // iniciar sesiony obtener el token
  const loginResponse = await api.post('/api/login').send({
    username: 'gigi',
    password: 'test123',
  });
  authHeader = `Bearer ${loginResponse.body.token}`;
}, 100000);

describe('User API tests', () => {
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

  test('creation fails without a username ', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Ana',
      password: 'ssfinen',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain(
      'username and password must be given'
    );
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
  test('creation fails without a password ', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'jussff',
      name: 'Giadadaora',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain(
      'username and password must be given'
    );
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
  test('creation fails without a unique username ', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'gigi',
      name: 'Giadadaora',
      password: 'ssfinen',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.errors.username.message).toContain(
      'expected `username` to be unique'
    );
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails without a username of at least 3 characters ', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ah',
      name: 'Giadadaora',
      password: 'ssfinen',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain(
      'username and password must be at least 3 characters long'
    );
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails without a password of at least 3 characters ', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ahmelia23',
      name: 'Giadadaora',
      password: 's',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain(
      'username and password must be at least 3 characters long'
    );
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
}, 100000);

describe('Blog API tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', authHeader)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', authHeader);
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('a specific blog can be viewed by id', async () => {
    const blogsAtStart = await helper.blogInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .set('Authorization', authHeader)
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
      .set('Authorization', authHeader)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });
  test('fails with status code 401 Unauthorized', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://testblog.com/',
    };

    await api.post('/api/blogs/').send(newBlog).expect(401);
  });
  test('a valid blog without likes property will return 0', async () => {
    const blogsAtStart = await helper.blogInDb();

    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    };
    await api
      .post('/api/blogs/')
      .send(newBlog)
      .set('Authorization', authHeader)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);

    const totalLikes = blogsAtEnd.map((blog) => blog.likes);
    expect(totalLikes).toContain(0);
  });
  test('a valid blog must have a title property', async () => {
    const blogsAtStart = await helper.blogInDb();

    const newBlog = {
      author: 'Mitchell Taylor',
      url: 'https://taylorpatterns.com/',
    };
    await api
      .post('/api/blogs/')
      .send(newBlog)
      .set('Authorization', authHeader)
      .expect(400);

    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });
  test('a valid blog must have an url property', async () => {
    const blogsAtStart = await helper.blogInDb();

    const newBlog = {
      title: 'JavaScript',
      author: 'Midu Dev',
    };
    await api
      .post('/api/blogs/')
      .send(newBlog)
      .set('Authorization', authHeader)
      .expect(400);

    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });
  test('deletion of a blog - succeeds with status code 204 deleted', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://testblog.com/',
    };
    const createdBlog = await api
      .post('/api/blogs/')
      .send(newBlog)
      .set('Authorization', authHeader)
      .expect(201);

    const blogsAtStart = await helper.blogInDb();
    const blogToDelete = createdBlog.body;

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', authHeader)
      .expect(204);

    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
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
      .set('Authorization', authHeader)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);

    const likesBeforeUpdate = blogsAtStart.map((blog) => blog.likes);
    const likesAfterUpdate = blogsAtEnd.map((blog) => blog.likes);
    expect(likesAfterUpdate).not.toContain(likesBeforeUpdate);
  });
}, 100000);

afterAll(async () => {
  await mongoose.connection.close();
});
