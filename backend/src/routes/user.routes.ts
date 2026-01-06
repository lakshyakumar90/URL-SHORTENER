import { Router } from "express";
import { generateSalt, generateHash } from "../utils/hash.ts";
import {
  loginPostRequestSchema,
  signupPostRequestSchema,
} from "../validation/request.validation.ts";
import { createUser, getUserByEmail } from "../services/user.service.ts";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/token.ts";

const router = Router();

router.post("/signup", async (req, res) => {
  const validationResult = await signupPostRequestSchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.format() });
  }

  const { firstname, lastname, email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return res
      .status(400)
      .json({ message: `User with email ${email} already exists` });
  }

  const salt = generateSalt();
  const hashedPassword = generateHash(password, salt);

  const user = await createUser({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    salt,
  });

  if (!user) {
    return res.status(500).json({ message: "Failed to create user" });
  }

  const token = generateToken(user.id);

  return res.status(201).json({
    message: "User created successfully",
    user,
    token,
  });
});

router.post("/login", async (req, res) => {
  const validationResult = await loginPostRequestSchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.format() });
  }

  const { email, password } = validationResult.data;

  const user = await getUserByEmail(email);

  if (!user) {
    return res
      .status(400)
      .json({ message: `User with email ${email} does not exist` });
  }

  const isPasswordValid = generateHash(password, user.salt) === user.password;

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = generateToken(user.id);

  const {
    password: _password,
    salt: _salt,
    ...userWithoutSensitiveData
  } = user;

  return res.status(200).json({
    message: "User logged in successfully",
    user: userWithoutSensitiveData,
    token,
  });
});

export default router;
