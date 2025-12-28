# AI-Powered Backend Code Reviewer & API Security Guard

A web-based system that analyzes Node.js/Express backend code using rule-based static analysis and LLM-powered reasoning to detect security flaws, poor API design, and architectural issues.

## 🚀 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite
- TanStack React Query
- shadcn/ui components
- Tailwind CSS
- Monaco Editor

### Backend
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- Multer (file uploads)
- OpenAI / Hugging Face API

## 📁 Project Structure

```
llm-code-reviewer/
├── frontend/          # React frontend application
├── backend/           # Express.js backend API
├── PROJECT_PHASES.md  # Development phases documentation
└── README.md         # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `env.example`):
```bash
cp env.example .env
```

4. Update `.env` with your configuration:
   - MongoDB connection string
   - OpenAI API key (or Hugging Face)
   - Other environment variables

5. Start development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `env.example`):
```bash
cp env.example .env
```

4. Update `.env` with your API URL if different from default

5. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📜 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## 🎯 Development Phases

See [PROJECT_PHASES.md](./PROJECT_PHASES.md) for detailed development phases and progress.

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `OPENAI_API_KEY` - OpenAI API key
- `HUGGINGFACE_API_KEY` - Hugging Face API key (optional)
- `FRONTEND_URL` - Frontend URL for CORS
- `MAX_FILE_SIZE` - Maximum file upload size
- `UPLOAD_DIR` - Directory for uploaded files

### Frontend (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## 🔒 Security Notes

- Never commit `.env` files to version control
- Keep API keys secure
- Use environment variables for all sensitive data

## 📄 License

ISC

## 👥 Contributing

This is a learning project. Contributions and suggestions are welcome!

---

**Status:** Phase 1 Complete - Project Setup & Foundation ✅

