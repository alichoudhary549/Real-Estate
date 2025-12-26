import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import '../../components/Auth/Auth.css'

const ResetPassword = () => {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const { resetPassword } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Client-side validation
      if (!token) return alert('Please provide a reset token')
      const passRe = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/
      if (!passRe.test(password)) return alert('Password must be at least 8 characters and include at least one letter and one number.')
      await resetPassword(token, password)
      alert('Password reset successful')
    } catch (err) {
      alert(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper paddings flexColCenter">
      <div className="auth-card">
        <h3 className="primaryText">Reset password</h3>
        <p className="secondaryText">Paste the reset token and enter your new password.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="input-label">
            <span>Reset Token</span>
            <input placeholder="Reset token" value={token} onChange={(e) => setToken(e.target.value)} />
          </label>
          <label className="input-label">
            <span>New password</span>
            <input placeholder="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          <button className="button auth-submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset password'}</button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
