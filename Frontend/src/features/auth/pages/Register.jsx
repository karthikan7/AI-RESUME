import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"
import { Sparkles, User, Mail, Lock, ArrowRight, UserPlus } from 'lucide-react'

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({ username, email, password })
        navigate("/")
    }

    if (loading) {
        return (
            <div className='loading-screen'>
                <div className='loading-pulse-wrapper'>
                    <div className='loading-glow' />
                    <div className='spinner' />
                </div>
                <p className='loading-text'>Creating your account...</p>
                <p className='loading-sub'><UserPlus size={14} /> Setting up your workspace</p>
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
                        <Sparkles size={12} /> Start Free Prep
                    </div>
                    <div className="auth-brand__logo">
                        <Sparkles size={28} />
                    </div>
                    <h1>Create Account</h1>
                    <p>Unlock AI-driven personalized interview plans</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">
                            <User size={14} /> Username
                        </label>
                        <div className="input-wrapper">
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="johndoe"
                                required
                            />
                        </div>
                    </div>
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
                                placeholder="Create a strong password"
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="auth-submit-btn">
                        <span>Get Started Free</span>
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    )
}

export default Register