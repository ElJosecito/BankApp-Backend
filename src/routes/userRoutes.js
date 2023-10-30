//Load express
const express = require("express");
//Load Router
const router = express.Router();
//Load config
//Load bcrypt
const bcrypt = require("bcrypt");
//Load jsonwebtoken
const jwt = require("jsonwebtoken");
//Load User model
const User = require("../schema/userSchema");
const account = require("../schema/accountSchema");


const ValidateToken = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado" });
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload.user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Handle token expiration
      return res.status(401).json({ message: "Token expirado" });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Error en el servidor" });
    }
  }
};
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
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const accessToken = GenerateAccessToken(user);
        return res.header("auth-token", accessToken).json({
          message: "Login correcto",
          user: user._id,
          token: accessToken,
        });
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
      name: user.name,
    },
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

//add account to user

router.put("/user/:id/account", async (req, res) => {
  try {
    const { id } = req.params;

    const userId = await User.findById(id);

    userId.account = await createAccount(userId.name, res);

    const savedUser = await userId.save();

    res.json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

//add account to user function

const createAccount = async (name, res) => {
  let randomNumber, number, existingAccount;

  do {
    // Generar un número aleatorio de 14 dígitos para el número de cuenta
    randomNumber = Math.floor(10000000000000 + Math.random() * 90000000000000);
    number = randomNumber.toString();

    // Verificar si el número de cuenta ya existe en la base de datos
  } while (existingAccount);

  if (existingAccount) {
    return res.status(400).json({ message: "La cuenta ya existe" });
  }

  const newAccount = new account({ name, number });

  const savedAccount = await newAccount.save();

  return savedAccount._id;
};

//get user with account and card
router.get("/user/account/:id", ValidateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Use populate to fetch the user, populate the "account" field, and within "account", populate the "card" field
    const userWithAccount = await User.findById(id).populate({
      path: 'account',
      populate: { path: 'card' }
    });

    res.json(userWithAccount);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
