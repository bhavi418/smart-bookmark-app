"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type Bookmark = {
  id: string
  title: string
  url: string
}

export default function Dashboard() {

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  // ✅ Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
  }

  // ✅ Add bookmark
  const addBookmark = async () => {

    if (!title || !url) return

    const { data: userData } = await supabase.auth.getUser()

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: userData.user?.id
    })

    setTitle("")
    setUrl("")
  }

  // ✅ Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id)
  }

  // ✅ Logout
  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  useEffect(() => {

    const init = async () => {
      await fetchBookmarks()
    }

    init()

    // 🔥 Realtime subscription
    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  }, [])

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">

      <h1 className="text-xl font-bold">Smart Bookmark Dashboard</h1>

      {/* ✅ Add Bookmark Form */}
      <div className="space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 w-full"
        />

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="border p-2 w-full"
        />

        <button
          onClick={addBookmark}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Add Bookmark
        </button>
      </div>

      {/* ✅ Bookmark List */}
      <div className="space-y-2">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="border p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{b.title}</p>
              <a
                href={b.url}
                target="_blank"
                className="text-blue-500 text-sm"
              >
                {b.url}
              </a>
            </div>

            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Logout Button */}
      <button
        onClick={logout}
        className="bg-gray-800 text-white p-2 rounded w-full"
      >
        Logout
      </button>

    </div>
  )
}
