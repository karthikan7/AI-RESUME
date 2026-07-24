import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports, error, setError } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError(null)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            if (response?.interviewReport) {
                setReport(response.interviewReport)
            }
        } catch (err) {
            console.error("Error generating report:", err)
            const msg = err.response?.data?.message || (err.response?.status === 429 ? "Rate limit reached (429). Gemini API limit exceeded, please wait 1 minute and try again." : "Failed to generate interview report.")
            setError(msg)
        } finally {
            setLoading(false)
        }

        return response?.interviewReport
    }

    const getReportById = async (interviewId) => {
        if (!interviewId || interviewId === "undefined") return null;
        setLoading(true)
        setError(null)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            if (response?.interviewReport) {
                setReport(response.interviewReport)
            }
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Failed to fetch report.")
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        setError(null)
        let response = null
        try {
            response = await getAllInterviewReports()
            if (response?.interviewReports) {
                setReports(response.interviewReports)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }

        return response?.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        if (!interviewReportId || interviewReportId === "undefined") return;
        setLoading(true)
        setError(null)
        let response = null
        try {
            //it will download the pdf 
            response = await generateResumePdf({ interviewReportId })
            if (response) {
                const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
                const link = document.createElement("a")
                link.href = url
                link.setAttribute("download", `resume_${interviewReportId}.pdf`)
                document.body.appendChild(link)
                link.click()
            }
        }
        catch (err) {
            console.error(err)
            setError(err.response?.data?.message || (err.response?.status === 429 ? "Rate limit reached (429). Please try again in 1 minute." : "Failed to generate resume PDF."))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()// tore users all report 
        }
    }, [ interviewId ])

    return { loading, report, reports, error, setError, generateReport, getReportById, getReports, getResumePdf }

}