import { createHmac, randomBytes } from "node:crypto";

export const generateSalt = () => randomBytes(256).toString("hex");

export const generateHash = (password: string, salt: string) =>
  createHmac("sha256", salt).update(password).digest("hex");
