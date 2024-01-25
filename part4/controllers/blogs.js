const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({});
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

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
  });

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({ error: 'token missing or invalid ' });
  } else {
    const result = await blog.save();
    response.status(201).json(result);
  }
});
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
  };

  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.json(blog);
  } catch (error) {
    next(error);
  }
});
module.exports = blogsRouter;
