import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";
import { signToken } from "../utils/jwt";

export async function register(
  username: string,
  name: string,
  email: string,
  password: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
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
    avatar: user.photo_profile,
    bio: user.bio,
    following: 0,
    followers: 0,
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
    include: {
      _count: {
        select: {
          following: true,
          followers: true,
        },
      },
    },
  });

  if (user) {
    const isMatch = await bcrypt.compare(password, user!.password);
    if (!isMatch)
      throw { status: 401, message: "Invalid username or password" };
  } else {
    throw { status: 401, message: "Invalid username or password" };
  }

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
    avatar: user.photo_profile,
    bio: user.bio,
    following: user._count.following,
    followers: user._count.followers,
    token,
  };
}
