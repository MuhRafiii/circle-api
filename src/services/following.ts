import { prisma } from "../prisma/client";

export async function followUser(followerId: number, followedId: number) {
  const [follower, followed] = await prisma.$transaction([
    prisma.user.findUnique({
      where: {
        id: followerId,
      },
    }),
    prisma.user.findUnique({
      where: {
        id: followedId,
      },
    }),
  ]);

  if (followed === follower) throw new Error("You cannot follow yourself");
  if (!followed) throw new Error("User not found");

  const existingFollowing = await prisma.following.findFirst({
    where: {
      follower_id: followerId,
      following_id: followedId,
    },
  });

  if (existingFollowing) throw new Error("You are already following this user");

  await prisma.following.create({
    data: {
      follower_id: followerId,
      following_id: followedId,
    },
  });

  return {
    user_id: followedId.toString(),
    is_following: true,
  };
}

export async function unfollowUser(followerId: number, followedId: number) {
  const existingFollowing = await prisma.following.findFirst({
    where: {
      follower_id: followerId,
      following_id: followedId,
    },
  });

  if (!existingFollowing) throw new Error("You are not following this user");

  await prisma.following.deleteMany({
    where: {
      follower_id: followerId,
      following_id: followedId,
    },
  });

  return {
    user_id: followedId.toString(),
    is_following: false,
  };
}

export async function getFollowers(userId: number) {
  const followers = await prisma.following.findMany({
    where: { following_id: userId },
    include: {
      follower: true,
    },
  });

  const result = await Promise.all(
    followers.map(async (f) => {
      const isFollowing = await prisma.following.findFirst({
        where: {
          follower_id: userId,
          following_id: f.follower.id,
        },
      });

      return {
        id: f.follower.id.toString(),
        username: f.follower.username,
        name: f.follower.full_name,
        bio: f.follower.bio,
        avatar: `http://localhost:3000/uploads/${f.follower.photo_profile}`,
        is_following: Boolean(isFollowing),
      };
    })
  );

  return { followers: result };
}

export async function getFollowing(userId: number) {
  const following = await prisma.following.findMany({
    where: { follower_id: userId },
    include: {
      following: true,
    },
  });

  const result = following.map((f) => ({
    id: f.following.id.toString(),
    username: f.following.username,
    bio: f.following.bio,
    name: f.following.full_name,
    avatar: `http://localhost:3000/uploads/${f.following.photo_profile}`,
  }));

  return { following: result };
}
