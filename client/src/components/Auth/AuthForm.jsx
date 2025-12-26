import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'
import GoogleSignIn from './GoogleSignIn'

const AuthForm = ({ type = 'login' }) => {
  const navigate = useNavigate()
  const { login, signup, googleLogin } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    if (!form.email || !form.password) return 'Please enter email and password.'
    const emailRe = /^\S+@\S+\.\S+$/
    if (!emailRe.test(form.email)) return 'Please enter a valid email address.'
    if (type === 'signup') {
      if (!form.name || form.name.trim().length < 2) return 'Please enter your name (at least 2 characters).'
      // Password strength: min 8 chars, at least one letter and one number
      const passRe = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/
      if (!passRe.test(form.password)) return 'Password must be at least 8 characters and include at least one letter and one number.'
    }
    return ''
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const v = validate()
    if (v) return setError(v)
    setLoading(true)
    try {
      if (type === 'login') await login({ email: form.email, password: form.password })
      else await signup({ name: form.name, email: form.email, password: form.password })
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    // Client-side Google Identity integration should call googleLogin with an idToken
    // This placeholder will show a friendly message and attempt to use the global google accounts if present
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt();
      // Real implementation should call the callback registered in the app to receive id_token
      return
    }
    alert('Google sign-in requires configuring Google Identity Services on the client and setting VITE_GOOGLE_CLIENT_ID.')
  }

  return (
    <div className="auth-wrapper paddings flexColCenter">
      <div className="auth-card">
        <h3 className="primaryText">{type === 'login' ? 'Welcome back' : "Create your account"}</h3>
        <p className="secondaryText">{type === 'login' ? 'Sign in to continue to RealEstate.' : 'Sign up to list and book properties.'}</p>

        <form className="auth-form" onSubmit={submit} noValidate>
          {type === 'signup' && (
            <label className="input-label">
              <span>Name</span>
              <input name="name" value={form.name} onChange={onChange} placeholder="Your name" />
            </label>
          )}

          <label className="input-label">
            <span>Email</span>
            <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
          </label>

          <label className="input-label">
            <span>Password</span>
            <input name="password" type="password" value={form.password} onChange={onChange} placeholder="••••••••" />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button className="button auth-submit" disabled={loading}>{loading ? 'Please wait...' : (type === 'login' ? 'Login' : 'Sign up')}</button>
        </form>

        <div className="auth-divider">or</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 220 }}>
            {/* GoogleSignIn renders the official Google button if VITE_GOOGLE_CLIENT_ID is set */}
            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
              <React.Suspense fallback={<button className="button auth-google">Sign in with Google</button>}>
                <GoogleSignIn onError={(err) => setError(err.message || 'Google sign-in failed')} />
              </React.Suspense>
            ) : (
              <button className="button auth-google" onClick={() => alert('Google Client ID not configured. Set VITE_GOOGLE_CLIENT_ID in client/.env and GOOGLE_CLIENT_ID in server/.env')}>Sign in with Google</button>
            )}
          </div>
        </div>

        <div className="auth-foot">
          {type === 'login' ? (
            <p>Don't have an account? <Link to="/signup">Create account</Link></p>
          ) : (
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthForm
