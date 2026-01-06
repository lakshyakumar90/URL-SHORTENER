import { Router } from "express";
import db from "../db/index.ts";
import { usersTable } from "../models/user.model.ts";
import { generateSalt, generateHash } from "../utils/hash.ts";
import { signupPostRequestSchema } from "../validation/request.validation.ts";
import { createUser, getUserByEmail } from "../services/user.service.ts";

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
    salt
  });

  if (!user) {
    return res.status(500).json({ message: "Failed to create user" });
  }

  return res.status(201).json({ message: "User created successfully", user });
});

export default router;
