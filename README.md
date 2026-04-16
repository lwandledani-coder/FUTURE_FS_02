# Mini CRM – Lead Management System

A full‑stack CRM built with Node.js, Express, MongoDB, and vanilla HTML/CSS/JS.

## Features
- Admin login (admin@crm.com / admin123)
- Add, edit, delete leads
- Lead status: new, contacted, converted, lost
- Lead source, priority, tags, follow‑up date
- Notes per lead
- Dark/Light mode toggle
- Secure session authentication

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: HTML, CSS, JavaScript
- Authentication: express‑session

## Setup Instructions
1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with:

4. MONGO_URI=mongodb+srv://wildvandeboar_db_user:SAKySF7o1b7kC6vG@cluster0.qbpjqom.mongodb.net/crmdb?appName=Cluster0
5. SESSION_SECRET=a-very-secret-key-ibutho-lika-Malombo

6. Run `node server.js`
7. Visit `http://localhost:3000`
8. Login with `admin@crm.com` / `admin123`