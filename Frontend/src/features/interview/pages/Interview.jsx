import React, { useState } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import { 
    ArrowLeft, Sparkles, Download, Code2, BrainCircuit, 
    CalendarRange, ChevronDown, Copy, Check, Target, ShieldAlert, BookOpen
} from 'lucide-react'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Q&A', icon: <Code2 size={18} /> },
    { id: 'behavioral', label: 'Behavioral Insights', icon: <BrainCircuit size={18} /> },
    { id: 'roadmap', label: 'Prep Roadmap', icon: <CalendarRange size={18} /> },
]

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = (e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(item.answer)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`q-card ${open ? 'q-card--open' : ''}`}>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__num'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'open' : ''}`}>
                    <ChevronDown size={18} />
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-tag q-tag--intention'>
                            <Target size={12} /> Interviewer's Intent
                        </span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <div className='q-card__section-top'>
                            <span className='q-tag q-tag--answer'>
                                <BookOpen size={12} /> Recommended Answer Strategy
                            </span>
                            <button className='copy-btn' onClick={handleCopy}>
                                {copied ? <Check size={12} color='#34d399' /> : <Copy size={12} />}
                                <span>{copied ? 'Copied!' : 'Copy Answer'}</span>
                            </button>
                        </div>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__badge'>
            <span>D{day.day}</span>
        </div>
        <div className='roadmap-day__card'>
            <h3>{day.focus}</h3>
            <ul className='roadmap-day__tasks'>
                {day.tasks.map((task, i) => (
                    <li key={i}>
                        <span className='bullet' />
                        <span>{task}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
)

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    if (loading || !report) {
        return (
            <div className='loading-screen'>
                <div className='loading-pulse-wrapper'>
                    <div className='loading-glow' />
                    <div className='spinner' />
                </div>
                <p className='loading-text'>Loading your interview strategy...</p>
            </div>
        )
    }

    const scoreColor = report.matchScore >= 80 ? 'high' : report.matchScore >= 60 ? 'mid' : 'low'
    const circumference = 2 * Math.PI * 40

    return (
        <div className='interview-page'>
            <div className='bg-orb bg-orb--1' />
            <div className='bg-orb bg-orb--2' />

                        <div className='interview-topbar'>
                <button className='back-btn' onClick={() => navigate('/')}>
                    <ArrowLeft size={16} />
                    <span>Dashboard</span>
                </button>

                <div className='interview-topbar__title'>
                    <div className='interview-topbar__logo'>
                        <Sparkles size={16} />
                    </div>
                    <span>{report.title}</span>
                </div>

                <button className='download-btn' onClick={() => getResumePdf(interviewId)} id='download-resume-btn'>
                    <Download size={15} />
                    <span>Tailored Resume</span>
                </button>
            </div>

            <div className='interview-layout'>

                                <nav className='interview-nav'>

                                        <div className='interview-nav__score'>
                        <p className='score-label'>Match Score</p>
                        <div className={`score-ring score-ring--${scoreColor}`}>
                            <svg viewBox="0 0 100 100">
                                <circle
                                    cx="50" cy="50" r="40"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.06)"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="50" cy="50" r="40"
                                    fill="none"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference * (1 - report.matchScore / 100)}
                                    transform="rotate(-90 50 50)"
                                    className='score-ring__arc'
                                />
                            </svg>
                            <div className='score-ring__value'>
                                <span>{report.matchScore}</span>
                                <small>%</small>
                            </div>
                        </div>
                        <p className='score-sub' style={{ color: report.matchScore >= 80 ? '#34d399' : report.matchScore >= 60 ? '#fbbf24' : '#f87171' }}>
                            {report.matchScore >= 80 ? '🟢 Strong Role Alignment' : report.matchScore >= 60 ? '🟡 Moderate Match' : '🔴 Focus Required'}
                        </p>
                    </div>

                                        <div className='interview-nav__items'>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`nav-item ${activeNav === item.id ? 'nav-item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                                <main className='interview-content'>

                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-count'>{report.technicalQuestions.length} core questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral & Scenario Insights</h2>
                                <span className='content-count'>{report.behavioralQuestions.length} scenario questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Roadmap</h2>
                                <span className='content-count'>{report.preparationPlan.length}-day roadmap</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                                <aside className='interview-sidebar'>
                    <div className='sidebar-section'>
                        <h3 className='sidebar-title'>Identified Skill Gaps</h3>
                        <div className='skill-gaps'>
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity?.toLowerCase() || 'medium'}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className='sidebar-section'>
                        <h3 className='sidebar-title'>Strategy Overview</h3>
                        <div className='summary-stats'>
                            <div className='stat'>
                                <span className='stat__num'>{report.technicalQuestions.length}</span>
                                <span className='stat__label'>Tech Q's</span>
                            </div>
                            <div className='stat'>
                                <span className='stat__num'>{report.behavioralQuestions.length}</span>
                                <span className='stat__label'>Behavioral</span>
                            </div>
                            <div className='stat'>
                                <span className='stat__num'>{report.preparationPlan.length}</span>
                                <span className='stat__label'>Days Plan</span>
                            </div>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    )
}

export default Interview
