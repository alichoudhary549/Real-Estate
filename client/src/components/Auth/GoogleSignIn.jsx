import React, { useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'

const GoogleSignIn = ({ onError }) => {
  const divRef = useRef(null)
  const { googleLogin } = useAuth()

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) return

    const insertScript = () => {
      if (document.getElementById('gsi-script')) return
      const s = document.createElement('script')
      s.src = 'https://accounts.google.com/gsi/client'
      s.id = 'gsi-script'
      s.async = true
      s.onload = init
      document.body.appendChild(s)
    }

    const init = () => {
      /* global google */
      if (!window.google || !window.google.accounts || !window.google.accounts.id) return
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (res) => {
          try {
            const idToken = res.credential
            if (!idToken) throw new Error('No credential returned from Google')
            await googleLogin(idToken)
          } catch (err) {
            onError && onError(err)
          }
        },
      })
      // render button into our container
      if (divRef.current) {
        window.google.accounts.id.renderButton(divRef.current, { theme: 'outline', size: 'large', text: 'signin_with' })
      }
    }

    if (window.google && window.google.accounts && window.google.accounts.id) init()
    else insertScript()
  }, [googleLogin, onError])

  return <div ref={divRef} />
}

export default GoogleSignIn
