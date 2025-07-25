import { prisma } from "../prisma/client";

export async function getRepliesByThread(
  threadId: number,
  page: number = 1,
  limit: number = 10
) {
  const replies = await prisma.reply.findMany({
    where: { thread_id: threadId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const repliesFormatted = replies.map((reply) => ({
    id: reply.id,
    content: reply.content,
    image: reply.image && `http://localhost:3000/uploads/${reply.image}`,
    user: {
      id: reply.user.id,
      username: reply.user.username,
      name: reply.user.full_name,
      profile_picture: `http://localhost:3000/uploads/${reply.user.photo_profile}`,
    },
    created_at: reply.created_at,
  }));

  return { replies: repliesFormatted };
}

export async function createReply(
  userId: number,
  threadId: number,
  content: string,
  image: string | null
) {
  const [user, reply] = await prisma.$transaction([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
    }),
    prisma.reply.create({
      data: {
        user_id: userId,
        thread_id: threadId,
        image,
        content,
        created_by: userId,
      },
    }),
  ]);

  const replyFormatted = {
    id: reply.id,
    thread_id: reply.thread_id,
    content: reply.content,
    image: reply.image && `http://localhost:3000/uploads/${reply.image}`,
    created_at: reply.created_at,
    user: {
      id: user!.id,
      username: user!.username,
      name: user!.full_name,
      profile_picture: `http://localhost:3000/uploads/${user!.photo_profile}`,
    },
  };

  return { reply: replyFormatted };
}
