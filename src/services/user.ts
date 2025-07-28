import { prisma } from "../prisma/client";

export async function updateUser(
  userId: number,
  updates: {
    username?: string;
    name?: string;
    bio?: string;
  },
  avatar?: string
) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      photo_profile: avatar,
      username: updates.username,
      full_name: updates.name,
      bio: updates.bio,
      updated_by: userId,
    },
  });

  return {
    id: updatedUser.id,
    username: updatedUser.username,
    name: updatedUser.full_name,
    email: updatedUser.email,
    bio: updatedUser.bio,
    avatar:
      updatedUser.photo_profile &&
      `http://localhost:3000/uploads/${updatedUser.photo_profile}`,
  };
}
