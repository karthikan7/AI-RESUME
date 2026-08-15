import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { 
    Sparkles, Briefcase, User, FileText, UploadCloud, 
    ArrowRight, LogOut, AlertTriangle, X, Clock, Bot, Zap, CheckCircle2, ChevronRight
} from 'lucide-react'

const Home = () => {
    const { loading, generateReport, reports, error, setError } = useInterview()
    const { user, handleLogout } = useAuth()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [fileName, setFileName] = useState(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current?.files?.[0]
        if (!jobDescription || !jobDescription.trim()) {
            setError("Please paste the Target Job Description before generating.")
            return
        }
        if (!resumeFile && (!selfDescription || !selfDescription.trim())) {
            setError("Please upload a Resume or enter a Quick Self-Description.")
            return
        }
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data && data._id) {
            navigate(`/interview/${data._id}`)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        setFileName(file ? file.name : null)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragOver(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
            const dt = new DataTransfer()
            dt.items.add(file)
            resumeInputRef.current.files = dt.files
            setFileName(file.name)
        }
    }

    if (loading) {
        return (
            <div className='loading-screen'>
                <div className='loading-pulse-wrapper'>
                    <div className='loading-glow' />
                    <div className='spinner' />
                </div>
                <p className='loading-text'>Generating your personalized interview plan...</p>
                <p className='loading-sub'><Bot size={16} /> Analyzing skill match & crafting questions (~30s)</p>
            </div>
        )
    }

    return (
        <div className='home-page'>
                        <div className='bg-orb bg-orb--1' />
            <div className='bg-orb bg-orb--2' />
            <div className='bg-orb bg-orb--3' />

                        <nav className='home-nav'>
                <div className='home-nav__brand'>
                    <div className='logo-box'>
                        <Sparkles size={20} />
                    </div>
                    <span className='home-nav__name'>PrepAI</span>
                </div>
                <div className='home-nav__right'>
                    {user?.username && (
                        <div className='home-nav__user'>
                            <User size={14} />
                            <span>{user.username}</span>
                        </div>
                    )}
                    <button className='home-nav__logout' onClick={handleLogout}>
                        <LogOut size={14} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </nav>

                        {error && (
                <div className='error-banner'>
                    <div className='error-banner__content'>
                        <AlertTriangle size={18} />
                        <span>{error}</span>
                    </div>
                    <button className='error-banner__close' onClick={() => setError(null)}>
                        <X size={18} />
                    </button>
                </div>
            )}

                        <header className='hero'>
                <div className='hero__badge'>
                    <Zap size={14} /> AI-Powered Interview Coach & Resume Sync
                </div>
                <h1 className='hero__title'>
                    Ace Your Next<br />
                    <span className='hero__gradient'>Dream Interview</span>
                </h1>
                <p className='hero__sub'>
                    Paste a job description, upload your resume, and let AI generate a customized 
                    preparation strategy — technical questions, behavioral insights, and a step-by-step roadmap.
                </p>
            </header>

                        <div className='gen-card'>
                <div className='gen-card__body'>

                                        <div className='gen-panel'>
                        <div className='gen-panel__header'>
                            <div className='gen-panel__icon'>
                                <Briefcase size={18} />
                            </div>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            className='gen-textarea'
                            placeholder='Paste the full job description here (responsibilities, required skills, qualifications)...'
                            maxLength={5000}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                        <div className='char-counter'>{jobDescription.length.toLocaleString()} / 5,000</div>
                    </div>

                    <div className='gen-divider' />

                                        <div className='gen-panel'>
                        <div className='gen-panel__header'>
                            <div className='gen-panel__icon'>
                                <User size={18} />
                            </div>
                            <h2>Your Candidate Profile</h2>
                        </div>

                                                <div className='upload-zone-wrap'>
                            <div className='upload-label'>
                                <span>Upload Resume</span>
                                <span className='badge badge--best'>Recommended</span>
                            </div>
                            <label
                                className={`upload-zone ${isDragOver ? 'upload-zone--drag' : ''} ${fileName ? 'upload-zone--filled' : ''}`}
                                htmlFor='resume'
                                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={handleDrop}
                            >
                                {fileName ? (
                                    <>
                                        <CheckCircle2 size={28} className='upload-zone__icon' color='#34d399' />
                                        <p className='upload-zone__filename'>
                                            <FileText size={16} /> {fileName}
                                        </p>
                                        <p className='upload-zone__hint'>Click to change file</p>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud size={32} className='upload-zone__icon' />
                                        <p className='upload-zone__title'>Click to upload or drag & drop</p>
                                        <p className='upload-zone__hint'>PDF files supported · Max 5MB</p>
                                    </>
                                )}
                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type='file'
                                    id='resume'
                                    name='resume'
                                    accept='.pdf'
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        <div className='or-divider'><span>OR</span></div>

                        <div className='self-desc-wrap'>
                            <label className='upload-label' htmlFor='selfDescription'>
                                Quick Self-Description
                            </label>
                            <textarea
                                id='selfDescription'
                                className='gen-textarea gen-textarea--short'
                                placeholder='Briefly summarize your role, key skills, tech stack, and experience...'
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                                <div className='gen-card__footer'>
                    <span className='gen-footer__info'>
                        <Bot size={16} /> Powered by Gemini AI Engine · ~30 seconds processing
                    </span>
                    <button className='gen-btn' onClick={handleGenerateReport} id='generate-report-btn'>
                        <span>Generate Strategy</span>
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>

                        {reports.length > 0 && (
                <section className='recent-section'>
                    <div className='recent-section__header'>
                        <h2>Recent Interview Plans</h2>
                        <span className='recent-section__count'>
                            {reports.length} report{reports.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className='reports-grid'>
                        {reports.map(report => (
                            <div
                                key={report._id}
                                className='report-card'
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <div className='report-card__top'>
                                    <h3 className='report-card__title'>
                                        {report.title || 'Untitled Position'}
                                    </h3>
                                    <span className={`report-card__score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                        {report.matchScore}% match
                                    </span>
                                </div>
                                <p className='report-card__date'>
                                    <Clock size={13} />
                                    {new Date(report.createdAt).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    })}
                                </p>
                                <div className='report-card__arrow'>
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

export default Home
