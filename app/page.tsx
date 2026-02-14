"use client"

import { supabase } from "@/lib/supabaseClient"

export default function Home() {

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback"
      }
    })
  }

  return (
    <div className="p-10">
      <button
        onClick={login}
        className="bg-blue-500 text-white p-3 rounded"
      >
        Login with Google
      </button>
    </div>
  )
}
