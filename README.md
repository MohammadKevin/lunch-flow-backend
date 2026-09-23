<div align="center">

# LunchFlow API

<p>Backend Service for Catering & Daily Meal Order Processing</p>

![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![NestJS](https://img.shields.io/badge/NestJS-blue?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square) ![Prisma ORM](https://img.shields.io/badge/Prisma%20ORM-blue?style=flat-square) ![JWT](https://img.shields.io/badge/JWT-blue?style=flat-square) ![REST API](https://img.shields.io/badge/REST%20API-blue?style=flat-square)

</div>

---

## Overview
High-performance NestJS REST API supporting LunchFlow with meal scheduling, order orchestration, user management, and payment verification.

---

## Key Features
- Menu scheduling and inventory quota management
- Order status workflow (Pending, Confirmed, Preparing, Delivered)
- Secure JWT authentication and role-based guards

---

## Tech Stack
- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: Prisma ORM
- **Database**: PostgreSQL / MySQL

---

## Project Structure
```text
lunch-flow-backend/
├── src/
│   ├── auth/           # Auth and token handling
│   ├── menu/           # Daily & weekly menu logic
│   └── orders/         # Order placement and tracking
└── prisma/             # Database schema
```

---

## Getting Started

### Prerequisites
Make sure you have the required runtimes and tools installed on your machine:
- Node.js (v18+ recommended) / Appropriate runtime
- Git

### Installation & Local Setup
```bash
git clone https://github.com/MohammadKevin/lunch-flow-backend.git
cd lunch-flow-backend
npm install
npm run start:dev
```

---

## Author
**Mohammad Kevin Arif Rudianto**
- **GitHub:** [@MohammadKevin](https://github.com/MohammadKevin)
- **Portfolio:** [portfolio-mohammadkevin.vercel.app](https://portfolio-mohammadkevin.vercel.app)
- **LinkedIn:** [Mohammad Kevin](https://www.linkedin.com/in/mohammad-kevin-arif-rudianto-945733347)
- **Email:** [kvn4.200581@gmail.com](mailto:kvn4.200581@gmail.com)

---

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

<div align="center">
If you found this repository useful, please consider giving it a star!
</div>
