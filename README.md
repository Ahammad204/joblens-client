# Joblens

[![Live Demo](https://img.shields.io/badge/Live%20Demo-joblenss.netlify.app-0fb894?style=for-the-badge&logo=netlify)](https://joblenss.netlify.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Ahammad204%2Fjoblens--client-181717?style=for-the-badge&logo=github)](https://github.com/Ahammad204/joblens-client)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **AI-Powered Job & Learning Platform** — Personalized career matching, skill gap analysis, roadmap generation, and CV intelligence.

---

## 🌐 Live Demo

**[https://joblenss.netlify.app/](https://joblenss.netlify.app/)**

---

## 📖 About

**Joblens** is a modern, AI-driven web application that bridges the gap between job seekers and opportunities. It provides personalized job and learning resource recommendations, AI-powered career roadmap generation, and automated CV analysis to help users navigate their career paths effectively.

Built with **React 19**, **Vite 7**, and **Tailwind CSS 4**, the platform leverages Google Generative AI and OpenRouter for intelligent career assistance.

---

## ✨ Key Features

### 🤖 AI-Powered Intelligence
| Feature | Description |
|---------|-------------|
| **Smart Job Matching** | Recommends jobs based on user skills, experience, and career track with match scores and reasoning |
| **Skill Gap Analysis** | Identifies missing skills for desired roles and suggests targeted learning resources |
| **AI Career Roadmap** | Generates personalized, step-by-step learning plans with phases, steps, and project ideas |
| **CV Auto-Analysis** | Extracts skills, tools, and roles from uploaded resumes using AI |
| **AI-Generated CV** | Creates professional CV layouts from profile data, downloadable as `.docx` |
| **Floating AI Chatbot** | Integrated career assistant for real-time queries (accessible site-wide) |

### 👤 User Features
- **Secure Authentication** — JWT-based login/register with forgot/reset password flow
- **Personalized Dashboard** — Central hub with recommended jobs, learning resources, and application tracking
- **Comprehensive Profile** — Skills, experience, education, career track, salary expectations, resume upload
- **Job Discovery** — Search, filter, and browse job listings with external platform links
- **Learning Resources** — Curated courses/videos matched to user skills
- **Progress Tracking** — Application history and roadmap progress

### 🛡️ Admin Features
- **Analytics Dashboard** — Users analyzed, jobs suggested, in-demand skills, common skill gaps
- **Job Management** — Full CRUD for job listings
- **Resource Management** — Full CRUD for learning resources

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | React 19, Vite 7, React Router 7 |
| **Styling** | Tailwind CSS 4, DaisyUI 5 |
| **State & Data** | TanStack Query (React Query) 5, Axios |
| **AI/ML** | Google Generative AI, OpenRouter API |
| **PDF/Document** | @react-pdf/renderer, docx, file-saver, html2pdf.js |
| **UI/UX** | Lucide React, React Icons, Lottie React, React Hot Toast |
| **Utilities** | LocalForage, Match Sorter, Sort By, React Markdown |
| **Dev Tools** | ESLint 9, TypeScript types |

---

## 📁 Project Structure

```
joblens/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Lottie animations, images
│   ├── componet/           # React components
│   │   ├── CVDocument/     # PDF CV document template
│   │   ├── FloatingChat/   # Floating AI chatbot widget
│   │   ├── chatbot/        # Full-page chatbot page
│   │   └── Shared/         # Shared UI (Login, Register, Loading, etc.)
│   ├── Hooks/              # Custom hooks (useAuth, useAdmin)
│   ├── Main/               # Main layout wrapper
│   ├── Pages/              # Page components
│   │   ├── AllJobs/        # Job listings
│   │   ├── AllJobsDetails/ # Job detail view
│   │   ├── AllResources/   # Learning resources
│   │   ├── Dashboard/      # Protected dashboard routes
│   │   │   ├── Admin/      # Admin analytics
│   │   │   ├── DashboardDetails/  # Main dashboard view
│   │   │   ├── ManageJobs/  # Admin job CRUD
│   │   │   ├── ManageResources/ # Admin resource CRUD
│   │   │   ├── ProfileAnysis/   # CV analysis & AI CV generation
│   │   │   ├── Roadmap/     # Career roadmap view
│   │   │   └── UserProfile/ # Profile editor
│   │   └── Home/           # Landing page sections
│   ├── Provider/           # Context providers (AuthProvider)
│   ├── Router/             # React Router configuration
│   ├── utils/              # Utilities (axios instances, skill extraction)
│   ├── index.css           # Global styles
│   └── main.jsx            # Entry point
├── .env                    # Environment variables (gitignored)
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ahammad204/joblens-client.git
cd joblens-client

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a .env file in the project root:
```

**`.env`**
```env
# Backend API base URL
VITE_API_BASE_URL=https://joblens-server.vercel.app

# ImgBB API key for image uploads (registration)
VITE_IMGBB_KEY=your_imgbb_api_key

# OpenRouter API key for AI features
VITE_OpenRouter_API_KEY=your_openrouter_api_key

# Web3Forms access key (contact form)
VITE_WEB3_ACCESS_KEY=your_web3forms_key
```

```bash
# 4. Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | Run ESLint on codebase |
| `npm run preview` | Preview production build locally |

---

## 🚢 Deployment

### Netlify (Recommended)
1. Push to GitHub
2. Connect repo to Netlify
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Style
- Run `npm run lint` before committing
- Follow existing component patterns
- Use functional components with hooks
- Keep components focused and reusable

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [Google Generative AI](https://ai.google.dev/) for AI capabilities
- [OpenRouter](https://openrouter.ai/) for LLM access
- [TanStack Query](https://tanstack.com/query) for server state management
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [LottieFiles](https://lottiefiles.com/) for animations

---

## 📞 Contact

**Ahammad204** — [GitHub](https://github.com/Ahammad204)

**Project Link:** [https://github.com/Ahammad204/joblens-client](https://github.com/Ahammad204/joblens-client)

**Live Demo:** [https://joblenss.netlify.app/](https://joblenss.netlify.app/)