🟣 circle-api (Backend)

📘 Deskripsi

Circle API adalah backend RESTful API untuk aplikasi Circle. Dibangun menggunakan Express.js dan Prisma ORM dengan pendekatan Clean Architecture, API ini menangani autentikasi, manajemen thread, reply, like, follow, serta integrasi real-time melalui WebSocket dan message queue.

🚀 Tech Stack
- Express.js — web framework backend
- Prisma ORM — manajemen database PostgreSQL
- JWT (JSON Web Token) — autentikasi
- Multer / Cloudinary — upload & penyimpanan gambar
- Redis — caching untuk endpoint tertentu
- Swagger — dokumentasi API
- Railway — deployment backend

📁 Struktur Folder
<pre>
  circle-api/
  │
  ├── src/
  │   ├── controllers/     # Request handler
  │   ├── services/        # Business logic (akses Prisma)
  │   ├── middlewares/     # Auth, error handler, dll
  │   ├── routes/          # Routing modular per fitur
  │   ├── validations/     # Validasi Joi
  │   ├── utils/           # Helper & JWT functions
  │   ├── prisma/          # Schema & client Prisma
  │   └── app.ts           # Entry point utama
  │
  └── package.json
</pre>

💻 Fitur Utama

✅ Register & Login (JWT Auth)  
✅ CRUD Thread (Text + Gambar)  
✅ Like & Reply System  
✅ Follow & Unfollow User  
✅ WebSocket untuk notifikasi thread baru  
✅ Message Queue untuk pemrosesan gambar  
✅ Redis Caching pada endpoint “My Tweet”  
✅ Swagger Documentation & Unit Testing  

⚙️ Cara Menjalankan Project
<pre>
  # Clone repository
  git clone https://github.com/username/circle-api.git
  cd circle-api
  
  # Install dependencies
  npm install
  
  # Jalankan Prisma
  npx prisma generate
  npx prisma migrate dev

  # Jalankan server
  npm run dev
</pre>

Server berjalan di:
👉 http://localhost:3000/api/v1

🌐 Deployment

API ini dideploy di Railway dan digunakan oleh frontend Circle UI di Vercel.

✨ Kontributor  

👤 Muhammad Rafi  
📧 mrafi0603@gmail.com  

🚀 Dibuat sebagai bagian dari proyek Dumbways Bootcamp Stage 2
