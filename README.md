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
3. Create a `.env` file in the root folder with the following content:
4. Replace YOUR_USERNAME, YOUR_PASSWORD, and the cluster address with your actual MongoDB Atlas credentials.

5. Run node server.js

6. Visit http://localhost:3000

7. Login with admin@crm.com / admin123

```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/crmdb?appName=Cluster0
SESSION_SECRET=your-random-secret-key-here
