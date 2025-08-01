import { prisma } from "../prisma/client";

export async function getThreads(
  currentUserId: number,
  page: number = 1,
  limit: number = 10
) {
  const threads = await prisma.thread.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
      _count: {
        select: {
          likes: true,
          replies: true,
        },
      },
      likes: {
        where: {
          user_id: currentUserId,
        },
        select: { id: true },
      },
    },
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const fullThreads = threads.map((thread) => ({
    ...thread,
    image:
      thread.image &&
      `https://circle-api-production-2c82.up.railway.app/uploads/${thread.image}`,
  }));

  const formattedThreads = fullThreads.map((thread) => ({
    id: thread.id,
    content: thread.content,
    created_at: thread.created_at,
    image: thread.image,
    user: {
      id: thread.user?.id,
      username: thread.user?.username,
      name: thread.user?.full_name,
      profile_picture: `https://circle-api-production-2c82.up.railway.app/uploads/${thread.user?.photo_profile}`,
    },
    likes: thread._count.likes,
    replies: thread._count.replies,
    isLiked: thread.likes.length > 0,
  }));

  return { threads: formattedThreads };
}

export async function getThreadDetail(id: number, currentUserId: number) {
  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
      _count: {
        select: {
          replies: true,
          likes: true,
        },
      },
      likes: {
        where: {
          user_id: currentUserId,
        },
        select: { id: true },
      },
    },
  });

  const threadDetail = {
    id: thread?.id,
    content: thread?.content,
    image:
      thread?.image &&
      `https://circle-api-production-2c82.up.railway.app/uploads/${thread?.image}`,
    user: {
      id: thread?.user?.id,
      username: thread?.user?.username,
      name: thread?.user?.full_name,
      profile_picture: `https://circle-api-production-2c82.up.railway.app/uploads/${thread?.user?.photo_profile}`,
    },
    created_at: thread?.created_at,
    likes: thread?._count.likes,
    replies: thread?._count.replies,
    isLiked: thread?.likes.length! > 0,
  };

  return threadDetail;
}

export async function createThread(
  userId: number,
  content: string,
  image: string | null
) {
  const [user, thread] = await prisma.$transaction([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
    }),
    prisma.thread.create({
      data: {
        content,
        image,
        created_by: userId,
      },
    }),
  ]);

  const tweet = {
    id: thread.id,
    content: thread.content,
    image:
      thread.image &&
      `https://circle-api-production-2c82.up.railway.app/uploads/${thread.image}`,
    created_at: thread.created_at,
    user: {
      id: user!.id,
      username: user!.username,
      name: user!.full_name,
      profile_picture: `https://circle-api-production-2c82.up.railway.app/uploads/${
        user!.photo_profile
      }`,
    },
    likes: 0,
    replies: 0,
    isLiked: false,
  };

  return { tweet };
}

export async function likeThread(userId: number, threadId: number) {
  const existingLike = await prisma.like.findFirst({
    where: { user_id: userId, thread_id: threadId },
  });

  let liked: boolean;

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
    liked = false;
  } else {
    await prisma.like.create({
      data: { user_id: userId, thread_id: threadId },
    });
    liked = true;
  }

  const likeCount = await prisma.like.count({ where: { thread_id: threadId } });

  return { liked, likeCount };
}
