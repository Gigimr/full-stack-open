const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });

    response.json(blogs);
  } catch (error) {
    response.status(500).json({ error: 'Error fetching blogs' });
  }
});

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);

    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    response.status(500).json({ error: 'Error fetching blog' });
  }
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({ error: 'token missing or invalid ' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = request.user;
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    if (blog.user && blog.user.toString() === user.id.toString()) {
      await Blog.deleteOne({ _id: request.params.id });
      response.status(204).end();
    } else {
      response.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error during delete request:', error);
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  };

  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.json(blog);
  } catch (error) {
    next(error);
  }
});
module.exports = blogsRouter;
