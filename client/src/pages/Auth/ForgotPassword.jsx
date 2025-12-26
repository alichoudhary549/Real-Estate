import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import '../../components/Auth/Auth.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const { forgotPassword } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const emailRe = /^\S+@\S+\.\S+$/
    if (!emailRe.test(email)) return alert('Please enter a valid email')
    setLoading(true)
    try {
      const res = await forgotPassword(email)
      alert('If the email exists a reset token was generated. In dev mode the token may be returned in response.')
    } catch (err) {
      alert(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper paddings flexColCenter">
      <div className="auth-card">
        <h3 className="primaryText">Forgot password</h3>
        <p className="secondaryText">Enter your account email and we'll send a reset token.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="input-label">
            <span>Email</span>
            <input placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button className="button auth-submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset token'}</button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
