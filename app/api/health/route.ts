import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Test database connection
    const { data, error } = await supabase.from("videos").select("count").limit(1)

    const dbStatus = error ? "error" : "connected"

    // Test storage connection
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
    const storageStatus = storageError ? "error" : "connected"

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        storage: storageStatus,
      },
      buckets: buckets?.map((b) => b.name) || [],
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Service unavailable",
      },
      { status: 500 },
    )
  }
}
