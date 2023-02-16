const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @Register  POST
// http://localhost:8000/api/v1/register
// public
const Register = async (req, res) => {
  const { name, email, profile, password } = req.body;

  if (!name || !email || !profile || !password) {
    res.status(400).json({ message: "Some details are missing" });
    console.log(req.body);
    return;
  }
  // check if user exists in db
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists in database" });
    return;
  }

  // register user
  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    name,
    email,
    profile,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      token: generateToken(user._id),
      createdAt: user.createdAt,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @login  POST
// http://localhost:8000/api/v1/login
// public
const Login = async (req, res) => {
  // check if details were sent
  const { name, password } = req.body;
  if (!name || !password) {
    res.status(400).json({ message: "Details missing" });
    return;
  }
  // check if user exists
  const user = await User.findOne({ name });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      // isAdmin: user.isAdmin,
      token: generateToken(user._id),
      createdAt: user.createdAt,
    });
  } else {
    res.status(400).send("Invalid credentials");
  }
};

// @me  GET
// http://localhost:8000/api/v1/me
// private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @me  PUT
// http://localhost:8000/api/v1/update
// private
const updateUser = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Could not update report" });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "4d",
  });
};

module.exports = { Register, Login, getMe, updateUser };
