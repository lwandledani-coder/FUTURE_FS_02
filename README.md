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

```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/crmdb?appName=Cluster0
SESSION_SECRET=your-random-secret-key-here
