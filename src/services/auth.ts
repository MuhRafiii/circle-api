import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";
import { signToken } from "../utils/jwt";

export async function register(
  username: string,
  name: string,
  email: string,
  password: string
) {
  let user = await prisma.user.findUnique({ where: { email: email } });
  if (user) {
    throw new Error("email already used");
  }

  user = await prisma.user.findUnique({ where: { username: username } });
  if (user) {
    throw new Error("username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await prisma.user.create({
    data: {
      username: username.toLowerCase(),
      full_name: name,
      email: email.toLowerCase(),
      password: hashedPassword,
    },
  });

  const token = signToken({
    id: user.id,
    username: user.username,
    name: user.full_name,
  });

  return {
    user_id: user.id,
    username,
    name: user.full_name,
    email,
    avatar: `http://localhost:3000/uploads/${user.photo_profile}`,
    bio: user.bio,
    token,
  };
}

export async function login(identifier: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: identifier.toLowerCase().trim() },
        { email: identifier.toLowerCase().trim() },
      ],
    },
  });

  const isMatch = await bcrypt.compare(password, user!.password);
  if (!user || !isMatch) throw new Error("Invalid username or password");

  const token = signToken({
    id: user.id,
    username: user.username,
    name: user.full_name,
  });
  return {
    user_id: user.id,
    username: user.username,
    name: user.full_name,
    email: user.email,
    avatar: `http://localhost:3000/uploads/${user.photo_profile}`,
    bio: user.bio,
    token,
  };
}
