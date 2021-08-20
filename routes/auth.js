import express from "express";
const router = express.Router();
import User from "../models/User";
import Joi from "@hapi/joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const schemaRegister = Joi.object({
  name: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(255).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(255).required(),
});

router.post("/login", async (req, res) => {
  const { error } = schemaLogin.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ error: "Usuário não encontrado" });
  }
  const validaPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validaPassword) {
    return res.status(400).json({ error: "Senha inválida" });
  }

  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    process.env.TOKEN_SECRET
  );

  res.header("auth-token", token).json({
    error: null,
    data: { token },
  });
  //   res.json({
  //     error: null,
  //     message: "Bem vinda",
  //     token: token,
  //   });
});

router.post("/register", async (req, res) => {
  const { error } = schemaRegister.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  const existingEmail = await User.findOne({ email: req.body.email });
  if (existingEmail) {
    return res.status(400).json({
      error: true,
      message: "Este email já está cadastrado em nossa base",
    });
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password,
  });

  try {
    const data = await user.save();
    res.json({
      error: null,
      data: data,
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
