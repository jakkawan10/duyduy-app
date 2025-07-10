import { createClient } from "@supabase/supabase-js"

if (!process.env.SUPABASE_URL) {
  throw new Error("Missing env.SUPABASE_URL")
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY")
}

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Storage buckets
export const STORAGE_BUCKETS = {
  VIDEOS: "duyduy-videos",
  ID_CARDS: "duyduy-id-cards",
  BANKBOOKS: "duyduy-bankbooks",
} as const

// File validation
export const FILE_LIMITS = {
  VIDEO: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ["video/mp4", "video/quicktime", "video/x-msvideo"],
    maxDuration: 60, // seconds
  },
  ID_CARD: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  BANKBOOK: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  },
} as const
