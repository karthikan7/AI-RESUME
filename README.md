# PrepAI - AI-Powered Interview Strategy & Resume Optimizer ✨

![PrepAI Banner](https://img.shields.io/badge/PrepAI-AI%20Interview%20Coach-8b5cf6?style=for-the-badge&logo=google-gemini)
![Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-06b6d4?style=for-the-badge&logo=google-gemini)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)
![Express](https://img.shields.io/badge/Backend-Express.js-000000?style=for-the-badge&logo=express)

**PrepAI** is a comprehensive, functional Generative AI application that solves a highly critical real-world problem: helping candidates bridge the gap between their current experience and their dream jobs. By analyzing a candidate's resume and a target job description, PrepAI generates a highly personalized interview preparation strategy.

This project was built for the **GenForge - Mini Challenge (CodeFury 9.0)**.

---

## 🚀 The Problem It Solves

Job seekers often struggle to identify exactly what skills they lack for a specific role and how to prepare effectively for technical and behavioral interviews. Generic interview preparation lacks focus, leading to wasted time and missed opportunities.

**PrepAI** leverages the **Google Gemini API** to act as a Principal Recruiter and Elite Engineering Manager, providing candidates with:
1. **Mathematical Match Scoring**: An honest evaluation of how well their profile aligns with the role.
2. **Tailored Technical & Behavioral Q&A**: High-signal interview questions crafted specifically around the overlap (and gaps) between the candidate's resume and the job description, complete with Interviewer Intent and Model Answers.
3. **Actionable Day-by-Day Roadmap**: A concrete, focused preparation schedule.
4. **ATS-Optimized Resume Generation**: A dynamically generated, perfectly formatted PDF resume that refactors the candidate's experience to highlight keywords and metrics relevant to the target job.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, SCSS (Obsidian Dark Glassmorphism UI), Lucide Icons
- **Backend**: Node.js, Express.js
- **Generative AI**: Google Gemini API (gemini-1.5-flash / gemini-2.0-flash)
- **PDF Generation**: Puppeteer / Chromium
- **Database / Auth**: Context API (Client-side simulation/JWT structure)

---

## 🌟 Key Features

*   **Obsidian Glassmorphism Dashboard**: A world-class, premium UI featuring smooth micro-interactions, responsive layouts, and beautiful radial glowing background orbs.
*   **Dual-Panel Generator**: Easily paste target job descriptions and drag-and-drop resume PDFs for instant analysis.
*   **Smart Question Accordions**: Interactive technical and behavioral questions featuring "One-Click Copy Answer" functionality.
*   **Skill Gap Analysis**: Severity-based skill gap identification (High/Medium/Low).
*   **Dynamic Resume PDF Generation**: Generates an ATS-friendly, highly tailored HTML resume under the hood and converts it to a downloadable PDF.

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

## 💡 Why this fits GenForge

This project goes beyond a simple chatbot wrapper. It uses structured output parsing (Zod schemas) to force the Generative AI to return complex, multi-layered JSON data. It perfectly blends a polished Frontend user experience with complex AI orchestration on the Backend to solve a high-impact, real-world challenge.

---
*Built with ❤️ for GenForge 2026*
