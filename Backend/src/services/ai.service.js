const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const chromiumModule = require("@sparticuz/chromium")
const chromium = chromiumModule.default || chromiumModule
const puppeteer = require("puppeteer-core")


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


// Retry wrapper with exponential backoff and model fallback for Gemini API rate limit (429) errors
async function withRetry(fn, maxRetries = 4, baseDelayMs = 3000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn()
        } catch (err) {
            const status = err?.status ?? err?.response?.status ?? err?.httpError?.statusCode ?? err?.code
            const isRateLimit = status === 429 || 
                                (err?.message && (
                                    err.message.includes("429") || 
                                    err.message.includes("RESOURCE_EXHAUSTED") || 
                                    err.message.includes("quota") ||
                                    err.message.includes("Too Many Requests")
                                ))

            if (isRateLimit && attempt < maxRetries) {
                const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 1000) // 3s, 7s, 15s...
                console.warn(`Gemini rate limit hit (429). Retrying in ${(delay / 1000).toFixed(1)}s... (attempt ${attempt}/${maxRetries})`)
                await new Promise(resolve => setTimeout(resolve, delay))
            } else {
                throw err
            }
        }
    }
}

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function callGeminiWithFallback(contents, schema) {
    const models = ["gemini-3.1-flash-lite", "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-flash-lite"]
    let lastError = null
    for (const model of models) {
        try {
            return await withRetry(() => ai.models.generateContent({
                model,
                contents,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(schema),
                }
            }))
        } catch (err) {
            lastError = err
            console.warn(`Model ${model} failed: ${err.message}. Trying next fallback model if available...`)
        }
    }
    throw lastError
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `You are a Principal Recruiter and Elite Engineering Manager at a top-tier tech firm. 
Analyze the candidate's details (Resume and Self-Description) against the target Job Description to generate a highly detailed and hyper-tailored Interview Strategy & Preparation Report.

Candidate Data:
- Resume Content: ${resume || 'None provided'}
- Self-Description: ${selfDescription || 'None provided'}

Target Role Profile:
- Job Description: ${jobDescription}

INSTRUCTIONS:
1. Match Score:
   - Provide an honest, mathematically rigorous score (0 to 100) based on tech stack alignment, experience level, seniority (e.g., junior vs. senior/lead), and core qualifications.
2. Technical Questions:
   - Craft 5 to 7 high-signal, non-generic technical questions that match the specific skills required. Include a mix of architectural design, system optimization, coding strategies, and framework-specific nuances.
   - For each question:
     - Intention: Explain exactly what deep competency or engineering principle is being tested (e.g., state-management efficiency, memory overhead, database indexing choice).
     - Answer: Provide a comprehensive, structured response model featuring industry-standard best practices, concrete architectural principles, or code snippets to demonstrate peak seniority.
3. Behavioral Questions:
   - Craft 3 to 5 realistic behavioral questions designed using the STAR model, focused on real-world engineering team dynamics, technical debt resolution, cross-functional collaboration, or post-mortem learnings relevant to the target role.
4. Skill Gaps:
   - Identify specific key technologies, methodologies (e.g., CI/CD, unit testing), or domain expertise requested in the Job Description but weak/missing in the candidate's profile. Assign a clear severity (low, medium, high).
5. Day-wise Roadmap:
   - Produce a customized, day-by-day (e.g., 5 to 7 days) preparation schedule.
   - For each day, define a clear focus and highly actionable, concrete tasks (e.g., "Implement a mock LRU Cache", "Review React 19 concurrent features", "Solve 3 SQL problems on Window functions") rather than generic tips like "study databases".
`

    const response = await callGeminiWithFallback(prompt, interviewReportSchema)
    return JSON.parse(response.text)
}


async function generatePdfFromHtml(htmlContent) {
    let browser
    try {
        const executablePath = await chromium.executablePath()
        if (executablePath) {
            browser = await puppeteer.launch({
                args: chromium.args,
                executablePath,
                headless: chromium.headless,
            })
        }
    } catch (e) {
        console.warn("Chromium executable path failed, using local browser fallback...")
    }

    if (!browser) {
        try {
            browser = await puppeteer.launch({ headless: true, channel: "chrome" })
        } catch (e) {
            browser = await puppeteer.launch({ headless: true, channel: "msedge" })
        }
    }

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
    })

    await browser.close()
    return pdfBuffer
}



async function generateResumePdf({ resume, selfDescription, jobDescription }) { // in this function we give resume and dicription as a input then it will generate respective resume

    // have to generate html from ai then pappet convert html to pdf then we will send that resumme 

    const resumePdfSchema = z.object({
        html: z.string().describe("The styled HTML content of the resume, suitable for PDF rendering via puppeteer.")
    })

    const prompt = `You are a professional Resume Designer and ATS Optimization Expert. 
Your goal is to output an exceptional, tailored HTML resume for a candidate targeting a specific job.

Input Details:
- Candidate's Resume: ${resume || 'None provided'}
- Candidate's Self-Description: ${selfDescription || 'None provided'}
- Target Job Description: ${jobDescription}

HTML & STYLING GUIDELINES (CRITICAL FOR A GORGEOUS PDF):
1. Layout & Styling:
   - Use clean, premium sans-serif typography (e.g., 'Helvetica Neue', 'Arial', sans-serif) with a font-size of 10pt to 11pt for readability.
   - Set a sophisticated, modern color theme:
     - Primary headings: Deep Navy/Slate (#1e293b)
     - Body text: Dark Charcoal (#334155)
     - Accents/Separators: Sleek Light Grey (#cbd5e1 or #e2e8f0)
   - Do NOT use wild, overly bright neon background colors. The background MUST be pure white (#ffffff).
   - Use a clear visual hierarchy: Name in large bold text (22-26px) at the top center, followed by a neat subtitle row containing email, phone, LinkedIn, and portfolio link separated by bullets (•).
   - Ensure clean spacing (margin-bottom of 10-15px on sections, margin-bottom of 6-8px on job descriptions).
   - Utilize a clean page design with proper CSS margins and print breaks:
     \`\`\`css
     @page {
         size: A4;
         margin: 15mm 15mm 15mm 15mm;
     }
     body {
         font-family: 'Helvetica Neue', Arial, sans-serif;
         color: #334155;
         line-height: 1.4;
         margin: 0;
         padding: 0;
         background: #ffffff;
     }
     .container {
         width: 100%;
         max-width: 800px;
         margin: 0 auto;
     }
     .header {
         text-align: center;
         margin-bottom: 20px;
     }
     .name {
         font-size: 24px;
         font-weight: 700;
         color: #1e293b;
         margin: 0 0 5px 0;
         letter-spacing: -0.5px;
     }
     .contact-info {
         font-size: 9.5pt;
         color: #64748b;
     }
     .section-title {
         font-size: 11pt;
         font-weight: 700;
         color: #1e293b;
         text-transform: uppercase;
         letter-spacing: 0.05em;
         border-bottom: 1.5px solid #cbd5e1;
         padding-bottom: 3px;
         margin-top: 18px;
         margin-bottom: 10px;
     }
     .job-entry {
         margin-bottom: 12px;
         page-break-inside: avoid;
     }
     .job-header {
         display: flex;
         justify-content: space-between;
         font-weight: 700;
         color: #1e293b;
         margin-bottom: 3px;
         font-size: 10.5pt;
     }
     .job-company {
         font-style: italic;
         color: #475569;
         font-size: 10pt;
     }
     .bullet-list {
         margin: 4px 0 0 16px;
         padding: 0;
     }
     .bullet-list li {
         margin-bottom: 4px;
         font-size: 9.5pt;
         color: #334155;
     }
     .skills-category {
         margin-bottom: 8px;
         font-size: 10pt;
     }
     .skills-label {
         font-weight: 700;
         color: #1e293b;
     }
     \`\`\`

2. Content Optimization & ATS Friendliness:
   - Ensure the HTML is perfectly semantic: use <h1>, <section>, <ul>, <li>, and <p> tags so ATS parsers can easily read the output.
   - Refactor the candidate's existing experience to align with keywords from the target Job Description, framing achievements with action-oriented verbs and quantifiable business impact metrics (e.g., "Increased page performance by 40%", "Accelerated delivery time by 20%").
   - Categorize technical skills logically (e.g., Languages, Frameworks, Databases, Tools).
   - Ensure the resume is concise, fitting on exactly 1 or 2 pages when converted to PDF. Focus on quality rather than quantity.
   - The final output should read as if it were written by a top-tier industry professional.
`

    const response = await callGeminiWithFallback(prompt, resumePdfSchema)

    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)//it will give the pdf

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }