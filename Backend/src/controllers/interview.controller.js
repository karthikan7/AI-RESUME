const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function parsePdfBuffer(buffer) {
    if (!buffer || !Buffer.isBuffer(buffer)) return ""

    // 1. Try standard pdf-parse (v1.1.1 function)
    try {
        const pdfParse = require("pdf-parse")
        if (typeof pdfParse === "function") {
            const parsed = await pdfParse(buffer)
            if (parsed && parsed.text && typeof parsed.text === "string" && parsed.text.trim()) {
                return parsed.text.trim()
            }
        }
    } catch (e) {
        console.warn("pdf-parse function attempt failed:", e.message)
    }

    // 2. Try pdf-parse PDFParse class (v2.x) if present
    try {
        const pdfModule = require("pdf-parse")
        if (pdfModule && pdfModule.PDFParse) {
            const uint8 = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
            const parser = new pdfModule.PDFParse({ data: uint8 })
            await parser.load()
            const parsed = await parser.getText()
            if (parsed && parsed.text && typeof parsed.text === "string" && parsed.text.trim()) {
                return parsed.text.trim()
            }
        }
    } catch (e) {
        console.warn("pdf-parse PDFParse class attempt failed:", e.message)
    }

    // 3. Fallback: extract ASCII string content directly from PDF buffer
    try {
        const str = buffer.toString("utf8")
        const cleanText = str.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ")
        if (cleanText.trim().length > 10) {
            return cleanText.substring(0, 4000)
        }
    } catch (e) {
        console.warn("Raw PDF buffer fallback failed:", e.message)
    }

    return "Resume PDF uploaded."
}

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = ""
        if (req.file && req.file.buffer) {
            resumeText = await parsePdfBuffer(req.file.buffer)
        }

        const { selfDescription, jobDescription } = req.body

        if (!jobDescription || (!resumeText && !selfDescription)) {
            return res.status(400).json({
                message: "Please provide a Target Job Description AND either upload a Resume or write a Self Description."
            })
        }

        //call the ai service 
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error in generateInterViewReportController:", error)
        if (error.status === 429 || (error.message && (error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("quota")))) {
            return res.status(429).json({
                message: "AI service rate limit exceeded. Google Gemini API free quota limit reached. Please wait 1 minute and try again."
            })
        }
        res.status(500).json({
            message: error?.message ? `AI Error: ${error.message}` : "Failed to generate interview report. Please try again later."
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport //take resume and disc from that interview id 

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (error) {
        console.error("Error in generateResumePdfController:", error)
        if (error.status === 429 || (error.message && (error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("quota")))) {
            return res.status(429).json({
                message: "AI service rate limit exceeded. Google Gemini API free quota limit reached. Please wait 1 minute and try again."
            })
        }
        res.status(500).json({
            message: "Failed to generate resume PDF. Please try again later."
        })
    }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }