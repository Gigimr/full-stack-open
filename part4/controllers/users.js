const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');
  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const body = request.body;
  if (!body.username || !body.password) {
    return response
      .status(400)
      .json({ error: 'username and password must be given' });
  }
  if (body.username.length < 3 || body.password.length < 3) {
    return response.status(400).json({
      error: 'username and password must be at least 3 characters long',
    });
  } else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });

    try {
      const savedUser = await user.save();
      response.json(savedUser);
    } catch (error) {
      response.status(400).json(error);
    }
  }
});

module.exports = usersRouter;
