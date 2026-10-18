# 💬 Chat App

## <a name="introduction">Introduction</a>

A chat app platform that lets users to chat and send messages with each other and also user/admin can create groups chat and add new users to group's chats. Built with latest React and Tailwind with M[...] 

## <a name="tech-stack">⚙️ Tech Stack</a>

- React 19
- MongoDb
- TailwindCSS
- Material UI
- Tailwind

## <a name="features">🔋 Features</a>

👉 **User Authentication with MongoDb**: Implement signup, login, and logout functionality using MongoDb authentication system.

👉 **Searching Users**: Implement search where user can search other users and start chat.

👉 **Creating Group Chats**: Implement group chat where admin/user can create, delete group chats.

👉 **Profile View**: user can view their profile username, email and avatar.

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-98.6%25-F7DF1E?logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?logo=vite&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-Open-blue)

A modern, fast, and responsive real-time chat application built with cutting-edge web technologies.

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Installation](#installation) • [Usage](#usage) • [Contributing]

</div>

---

## ✨ Features

- 🚀 **Lightning Fast** - Built with Vite for instant HMR and optimized builds
- ⚡ **Real-time Chat** - Seamless messaging experience
- 🎨 **Modern UI** - Beautiful and intuitive user interface
- 📱 **Responsive Design** - Works perfectly on all devices
- 💻 **React Powered** - Built with React for component-based architecture
- 🔧 **ESLint Configured** - Code quality and consistency built-in
- 🛠️ **Developer Friendly** - Easy to set up and extend

---

## 🛠️ Tech Stack

| Technology     | Purpose                 | Version |
| -------------- | ----------------------- | ------- |
| **React**      | UI Framework            | 18+     |
| **Vite**       | Build Tool & Dev Server | 5.0+    |
| **JavaScript** | Primary Language        | ES6+    |
| **Oxc**        | Fast JavaScript Parser  | Latest  |

**Language Composition:**

- 📊 JavaScript: 98.6%
- 📊 Other: 1.4%

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn package manager
- Git
- MongoDB (local or a hosted MongoDB URI)

## 🔧 Installation

Follow these steps to get the project running locally.

1. Clone the repository

```bash
git clone https://github.com/Abbas-shah10/chat-app.git
cd chat-app
```

2. Install dependencies (frontend and backend if applicable)

If this repository contains both frontend and backend in separate folders (e.g., `client/` and `server/`), run the commands in each folder. If it's a single frontend app, run the commands in the repo root.

Frontend (example):

```bash
# using npm
npm install
# or using yarn
yarn install
```

Backend (example if present in `server/`):

```bash
cd server
npm install
# or
yarn install
```

3. Create environment variables

Create a `.env` file in the project (or `server/`) and add the required variables. Example for a typical chat app:

```.env
# Server
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/chat-app?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret

# Client (if needed)
VITE_API_URL=http://localhost:5000/api
```

Replace the values above with your real credentials. Do not commit `.env` to source control.

4. Run the app locally

Frontend (development mode):

```bash
# from project root (or client/)
npm run dev
# or
yarn dev
```

Backend (development mode, if applicable):

```bash
cd server
npm run dev
# or
yarn dev
```

Open http://localhost:5173 (Vite default) or the URL shown in the terminal to view the app.

5. Build for production

To create an optimized production build for the frontend:

```bash
npm run build
# or
yarn build
```

Then serve the build with a static server or configure your backend to serve the `dist/` folder.

6. Optional — Docker

If you prefer Docker, add a `Dockerfile` and `docker-compose.yml` (not included in this repo by default). Example compose to run frontend + backend + MongoDB is beyond the scope of this README but recommended for production-like setups.

---

## ⚙️ Environment Example (.env.example)

```
PORT=5000
MONGO_URI=
JWT_SECRET=
VITE_API_URL=
```

Copy this file to `.env` and fill in the values.

---

## 🧪 Testing

If the project includes tests, run them with:

```bash
npm test
# or
yarn test
```
