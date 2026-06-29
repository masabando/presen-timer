import './App.css'
import LoginButton from './components/LoginButton'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, provider } from '../firebase'
import Timer from './components/Timer'
import { useEffect, useState } from 'react'

export default function App() {
  const [user, loading] = useAuthState(auth)
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    if (user && user.email === "bando@ktc.ac.jp") {
      setAdmin(true)
    }
  }, [user])

  return (
    <div>
      <LoginButton user={user} loading={loading} auth={auth} provider={provider} />
      <Timer admin={admin} />
    </div>
  )
}
