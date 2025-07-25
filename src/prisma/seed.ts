import { prisma } from "../prisma/client";

async function main() {
  const [user1, user2, thread] = await prisma.$transaction([
    prisma.user.findUnique({
      where: {
        id: 2,
      },
    }),
    prisma.user.findUnique({
      where: {
        id: 3,
      },
    }),
    prisma.thread.findUnique({
      where: {
        id: 67,
      },
    }),
  ]);

  await prisma.reply.createMany({
    data: [
      {
        user_id: user1!.id,
        thread_id: thread!.id,
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit explicabo consequatur illo adipisci nulla possimus non dolorem beatae nostrum tenetur alias esse laboriosam velit, harum animi vero iste quae dolorum",
        created_by: user1!.id,
      },
      {
        user_id: user2!.id,
        thread_id: thread!.id,
        content:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. A quos error facilis quia ex, sunt repellendus asperiores nostrum doloremque porro. Est, dolor. Laborum nam dolorum commodi in cupiditate cum sapiente?",
        created_by: user2!.id,
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seeding completed ✅");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
