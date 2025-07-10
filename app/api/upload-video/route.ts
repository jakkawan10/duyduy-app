import { type NextRequest, NextResponse } from "next/server"
import { supabase, STORAGE_BUCKETS, FILE_LIMITS } from "@/lib/supabase"
import { validateFileType, validateFileSize, generateFileName, sanitizeFileName } from "@/lib/file-utils"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string
    const title = (formData.get("title") as string) || "Untitled Video"
    const description = (formData.get("description") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "ไม่พบไฟล์ที่อัปโหลด" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "ต้องระบุ userId" }, { status: 400 })
    }

    // Validate file type
    const typeValidation = validateFileType(file, FILE_LIMITS.VIDEO.allowedTypes)
    if (!typeValidation.isValid) {
      return NextResponse.json({ error: typeValidation.error }, { status: 400 })
    }

    // Validate file size
    const sizeValidation = validateFileSize(file, FILE_LIMITS.VIDEO.maxSize)
    if (!sizeValidation.isValid) {
      return NextResponse.json({ error: sizeValidation.error }, { status: 400 })
    }

    // Generate file path
    const sanitizedName = sanitizeFileName(file.name)
    const filePath = generateFileName(sanitizedName, `videos/${userId}`)

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from(STORAGE_BUCKETS.VIDEOS).upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปโหลด" }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKETS.VIDEOS).getPublicUrl(filePath)

    // Save video metadata to database (optional)
    const videoMetadata = {
      id: crypto.randomUUID(),
      user_id: userId,
      title: title,
      description: description,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
      public_url: urlData.publicUrl,
      status: "uploaded",
      created_at: new Date().toISOString(),
    }

    // Insert metadata into videos table
    const { error: dbError } = await supabase.from("videos").insert(videoMetadata)

    if (dbError) {
      console.error("Database insert error:", dbError)
      // Don't fail the upload if DB insert fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: videoMetadata.id,
        url: urlData.publicUrl,
        filePath: filePath,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        title: title,
        description: description,
      },
    })
  } catch (error) {
    console.error("Upload video error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Video Upload API",
    limits: FILE_LIMITS.VIDEO,
    bucket: STORAGE_BUCKETS.VIDEOS,
  })
}
