import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../prismaClient.js';

const router = express.Router();

// Register a new user POST /auth/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  // save the username | email and password
  // password saved is a one way encrypted version of the password provided during registration

  // encrypt the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // save the new user into the database
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // no that we have a new user add a default todo for them
    const defaultTodo = `Hello ;) Add your first todo!`;
    await prisma.todo.create({
      data: {
        task: defaultTodo,
        userId: user.id,
      },
    });
    // create a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

router.post('/login', async (req, res) => {
  // get the email | username and password
  // lookup the database to see a user that has that same email and get that password (encrypted password saved previously)
  // encrypt the provided password and compare with the retrieved password associated with that user's info in the database
  const { username, password } = req.body;
  // login user
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    // if there is no user that matches return out of the function
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    // return if password does not match
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    console.log(user);
    // authentication successful, create token for authorization
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

export default router;
