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

export async function deletePhotoProfile(userId: number) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      photo_profile: "default.png",
    },
  });

  return {
    avatar: `http://localhost:3000/uploads/${updatedUser.photo_profile}`,
  };
}

export async function searchUser(userId: number, keyword: string) {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: keyword } },
        { full_name: { contains: keyword } },
      ],
    },
    include: {
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });

  const filteredUsers = users.filter((user) => user.id !== userId);
  const result = await Promise.all(
    filteredUsers.map(async (user) => {
      const isFollowing = await prisma.following.findFirst({
        where: {
          follower_id: userId,
          following_id: user.id,
        },
      });

      return {
        id: user.id.toString(),
        username: user.username,
        name: user.full_name,
        bio: user.bio,
        avatar: `http://localhost:3000/uploads/${user.photo_profile}`,
        followers: user._count.followers,
        is_following: Boolean(isFollowing),
      };
    })
  );

  return { users: result };
}

export async function followSuggestions(userId: number) {
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },
    },
    include: {
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });

  const result = await Promise.all(
    users.map(async (user) => {
      const isFollowing = await prisma.following.findFirst({
        where: {
          follower_id: userId,
          following_id: user.id,
        },
      });

      return {
        id: user.id.toString(),
        username: user.username,
        name: user.full_name,
        bio: user.bio,
        avatar: `http://localhost:3000/uploads/${user.photo_profile}`,
        followers: user._count.followers,
        is_following: Boolean(isFollowing),
      };
    })
  );

  const suggestions = result.filter((user) => !user.is_following).slice(0, 5);

  return { users: suggestions };
}
