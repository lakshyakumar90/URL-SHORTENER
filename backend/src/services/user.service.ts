import { eq } from "drizzle-orm";
import db from "../db/index.ts";
import { usersTable } from "../models/user.model.ts";

interface User {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    salt: string;
}

const getUserByEmail = async (email: string) => {
  const [user] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      firstname: usersTable.firstname,
      lastname: usersTable.lastname,
      salt: usersTable.salt,
      password: usersTable.password,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user;
};

const createUser = async (user: User) => {
    const [createdUser] = await db.insert(usersTable).values(user).returning({
        id: usersTable.id,
        email: usersTable.email,
        firstname: usersTable.firstname,
        lastname: usersTable.lastname,
    });
    if (!createdUser) {
        throw new Error("Failed to create user");
    }
    return createdUser;
}

export {getUserByEmail, createUser};
