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
    email: user.email,
    username: user.username,
  });

  return {
    user_id: user.id,
    username,
    name: user.full_name,
    email,
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

  if (!user) throw new Error("user not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("wrong password");

  const token = signToken({
    id: user.id,
    email: user.email,
    username: user.username,
  });
  return {
    user_id: user.id,
    username: user.username,
    name: user.full_name,
    email: user.email,
    avatar: `http://localhost:3000/uploads/${user.photo_profile}`,
    token,
  };
}

// export async function updateUser(id: number, name: string, picture: string) {
//   const update = await prisma.user.update({
//     where: { id },
//     data: { name, picture },
//   });

//   return { name: update.name, picture: update.picture };
// }
