//Load express
const express = require("express");
//Load Router
const router = express.Router();
//Load config
const config = require("../../config");
//Load bcrypt
const bcrypt = require("bcrypt");
//Load jsonwebtoken
const jwt = require("jsonwebtoken");
//Load User model
const User = require("../schema/userSchema");

//get all users
router.get("/users", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
    console.log("All users get successfully");
  } catch (err) {
    res.json({ message: err });
  }
});

//get user by id
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userId = await User.findById(id);

    res.json(userId);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

//register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "El email ya existe" });
    }

    const user = new User({ email, password, name });
    await user.save();
    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

//login user
router.post("/login", async (req, res) => {
  try {
    const {email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
    
      if (isPasswordValid) {
        const accessToken = GenerateAccessToken(user);
        return res.header("auth-token", accessToken).json({ message: "Login correcto", user: user._id , token: accessToken });
      } else {
        return res.status(400).json({ message: "Credenciales incorrectas" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

//Generate token

const GenerateAccessToken = (user) => {

  const payload = {
    user: {
      name: user.name
    },
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

module.exports = router;
