import { NextResponse } from "next/server"

export async function GET(request: Request) {

  const url = new URL(request.url)

  // ✅ Detect if running on localhost or production automatically
  const origin = url.origin

  return NextResponse.redirect(`${origin}/dashboard`)
}
