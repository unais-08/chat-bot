# Mini GPT - AI-Powered Chat Application

A full-stack, production-ready AI chatbot application with a modern, minimal design. Built with React, Express, PostgreSQL, and Google's Gemini AI.

## 🚀 Features

- **Real-time AI Conversations** - Powered by Google Gemini AI with streaming responses
- **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- **Chat Management** - Create, view, search, sort, and delete conversations
- **Modern UI/UX** - Minimal zinc/slate theme with smooth animations and transitions
- **Markdown Support** - Rich text rendering with syntax highlighting for code blocks

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Google Gemini API key

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/unais-08/chat-bot.git
cd chat-bot
```

2. **Setup Backend**

```bash
cd server
npm install
```

Create `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chatbot"
JWT_SECRET="your-secret-key-here"
PORT=5000
```

Run database migrations:

```bash
npm run db:generate
npm run db:push
```

Start server:

```bash
npm run dev
```

3. **Setup Frontend**

```bash
cd ../client
npm install
```

Create `.env` file:

```env
VITE_API_URL=
VITE_GEMINI_API_KEY=your-gemini-api-key
```

Start development server:

```bash
npm run dev
```

### Building for Production

**Frontend:**

```bash
cd client
npm run build
# Output: dist/
```

**Backend:**

```bash
cd server
npm start
```

---

## 📝 Environment Variables

### Frontend (.env)

```env
VITE_API_URL=
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Backend (.env)

```env
DATABASE_URL=
JWT_SECRET=your_jwt_secret_key
PORT=
NODE_ENV=development
```

---
