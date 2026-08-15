# PrepAI - AI-Powered Interview Strategy & Resume Optimizer ✨

<div align="center">
  <img src="https://img.shields.io/badge/PrepAI-AI%20Interview%20Coach-8b5cf6?style=for-the-badge&logo=google-gemini" alt="PrepAI Banner" />
  <img src="https://img.shields.io/badge/Powered%20by-Gemini%20AI-06b6d4?style=for-the-badge&logo=google-gemini" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Backend-Express.js-000000?style=for-the-badge&logo=express" alt="Express" />
</div>

<br />

**PrepAI** is a comprehensive, functional Generative AI application built for the **GenForge - Mini Challenge (CodeFury 9.0)**. It solves a highly critical real-world problem: helping candidates bridge the gap between their current experience and their dream jobs by analyzing their resume against a target job description to generate a highly personalized, actionable interview preparation strategy.

---

## 🚀 The Problem It Solves

Job seekers often struggle to identify exactly what skills they lack for a specific role and how to prepare effectively for technical and behavioral interviews. Generic interview preparation lacks focus, leading to wasted time and missed opportunities.

**PrepAI** leverages the **Google Gemini API** to act as a Principal Recruiter and Elite Engineering Manager, providing candidates with:
1. **Mathematical Match Scoring**: An honest evaluation of how well their profile aligns with the role.
2. **Tailored Technical & Behavioral Q&A**: High-signal interview questions crafted specifically around the overlap (and gaps) between the candidate's resume and the job description, complete with Interviewer Intent and Model Answers.
3. **Actionable Day-by-Day Roadmap**: A concrete, focused preparation schedule spanning several days.
4. **ATS-Optimized Resume Generation**: A dynamically generated, perfectly formatted HTML/PDF resume that refactors the candidate's experience to highlight keywords and metrics relevant to the target job.

---

## 🌟 Core Value Proposition

- **Not Just a Chatbot**: PrepAI forces the Generative AI to output strictly structured, multi-layered JSON data using Zod schemas, converting unstructured text into a fully interactive dashboard.
- **Deep Personalization**: Questions aren't generic (e.g., "What is React?"). They are hyper-specific to the intersection of the candidate's actual experience and the company's tech stack.
- **End-to-End Workflow**: It guides a user from the initial job application (Resume Generation) straight through to the final interview stage (Q&A and Prep Roadmap).

---

## 🏗️ System Architecture & Workflow

```mermaid
graph TD;
    A[User Inputs: Resume PDF + Job Description] -->|Frontend React App| B(Express.js Backend);
    B -->|Constructs Elite Persona Prompts| C{Google Gemini API};
    C -->|Returns Zod-Validated JSON| B;
    B -->|Returns JSON Strategy| D[Dashboard UI Rendering];
    B -->|Generates Styled HTML| E(Puppeteer Headless Browser);
    E -->|Converts HTML to PDF| F[ATS-Friendly Tailored Resume Download];
```

---

## 🛠️ Tech Stack & Implementation Details

### Frontend (Client)
- **Framework**: React.js with Vite for lightning-fast HMR and optimized builds.
- **Styling**: SCSS implementing a world-class **Obsidian Dark Glassmorphism UI**. Features include ambient glowing radial orbs, frosted glass cards, shimmer loading states, and custom scrollbars.
- **Icons**: Lucide-React for clean, modern SVG iconography.

### Backend (Server)
- **Environment**: Node.js & Express.js.
- **Generative AI Core**: `@google/genai` SDK using `gemini-1.5-flash` and `gemini-2.0-flash` for high-speed, cost-effective reasoning.
- **Schema Validation**: `zod` and `zod-to-json-schema` to enforce strict JSON structures from the LLM.
- **PDF Generation**: `puppeteer-core` and `@sparticuz/chromium` to dynamically render AI-generated CSS/HTML into a flawless, downloadable A4 PDF resume.

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (v18+)
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/karthikan7/AI-RESUME.git
   cd AI-RESUME
   \`\`\`

2. **Setup the Backend:**
   \`\`\`bash
   cd Backend
   npm install
   \`\`\`
   - Create a \`.env\` file in the \`Backend\` directory and add your API key:
     \`\`\`env
     GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
     \`\`\`
   - Start the backend server:
     \`\`\`bash
     npm start
     \`\`\`

3. **Setup the Frontend:**
   Open a new terminal and navigate to the Frontend directory:
   \`\`\`bash
   cd Frontend
   npm install
   npm run dev
   \`\`\`

4. **Access the App:**
   Open your browser and navigate to \`http://localhost:5173\`.

---

## 🔮 Future Scope
- **Audio Mock Interviews**: Integrating Web Speech API to let users practice the generated questions verbally against an AI voice avatar.
- **LinkedIn Integration**: Directly importing candidate profiles via OAuth to bypass manual resume uploads.
- **Analytics Dashboard**: Tracking match score improvements over time as candidates complete their preparation roadmaps.

---
<div align="center">
  <i>Built with ❤️ for GenForge - IEEE UVCE CodeFury 9.0 (2026)</i>
</div>
