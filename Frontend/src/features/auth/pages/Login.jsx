import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate('/')
    }

    if (loading) {
        return (
            <div className='loading-screen'>
                <div className='loading-pulse-wrapper'>
                    <div className='loading-glow' />
                    <div className='spinner' />
                </div>
                <p className='loading-text'>Logging you in...</p>
                <p className='loading-sub'><ShieldCheck size={14} /> Verifying credentials</p>
            </div>
        )
    }

    return (
        <div className="auth-page">
            <div className='bg-orb bg-orb--1' />
            <div className='bg-orb bg-orb--2' />

            <div className="auth-card">
                <div className="auth-brand">
                    <div className="auth-brand__badge">
                        <Sparkles size={12} /> AI Interview Preparation
                    </div>
                    <div className="auth-brand__logo">
                        <Sparkles size={28} />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to access your interview strategies</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">
                            <Mail size={14} /> Email address
                        </label>
                        <div className="input-wrapper">
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">
                            <Lock size={14} /> Password
                        </label>
                        <div className="input-wrapper">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="auth-submit-btn">
                        <span>Sign In</span>
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Create one free</Link>
                </div>
            </div>
        </div>
    )
}

export default Login