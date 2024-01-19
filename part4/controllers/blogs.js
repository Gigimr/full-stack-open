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
    likes: body.likes,
  });

  try {
    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    response.status(500).json({ error: 'Error saving the blog' });
  }
});

module.exports = blogsRouter;
