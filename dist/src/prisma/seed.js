"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../prisma/client");
async function main() {
    const [user1, user2, thread] = await client_1.prisma.$transaction([
        client_1.prisma.user.findUnique({
            where: {
                id: 2,
            },
        }),
        client_1.prisma.user.findUnique({
            where: {
                id: 3,
            },
        }),
        client_1.prisma.thread.findUnique({
            where: {
                id: 67,
            },
        }),
    ]);
    await client_1.prisma.reply.createMany({
        data: [
            {
                user_id: user1.id,
                thread_id: thread.id,
                content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit explicabo consequatur illo adipisci nulla possimus non dolorem beatae nostrum tenetur alias esse laboriosam velit, harum animi vero iste quae dolorum",
                created_by: user1.id,
            },
            {
                user_id: user2.id,
                thread_id: thread.id,
                content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. A quos error facilis quia ex, sunt repellendus asperiores nostrum doloremque porro. Est, dolor. Laborum nam dolorum commodi in cupiditate cum sapiente?",
                created_by: user2.id,
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
    await client_1.prisma.$disconnect();
});
