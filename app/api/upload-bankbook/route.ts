import { type NextRequest, NextResponse } from "next/server"
import { supabase, STORAGE_BUCKETS, FILE_LIMITS } from "@/lib/supabase"
import { validateFileType, validateFileSize, generateFileName, sanitizeFileName, compressImage } from "@/lib/file-utils"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string
    const bankName = formData.get("bankName") as string
    const accountNumber = formData.get("accountNumber") as string

    if (!file) {
      return NextResponse.json({ error: "ไม่พบไฟล์ที่อัปโหลด" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "ต้องระบุ userId" }, { status: 400 })
    }

    if (!bankName || !accountNumber) {
      return NextResponse.json({ error: "ต้องระบุชื่อธนาคารและเลขบัญชี" }, { status: 400 })
    }

    // Validate file type
    const typeValidation = validateFileType(file, FILE_LIMITS.BANKBOOK.allowedTypes)
    if (!typeValidation.isValid) {
      return NextResponse.json({ error: typeValidation.error }, { status: 400 })
    }

    // Validate file size
    const sizeValidation = validateFileSize(file, FILE_LIMITS.BANKBOOK.maxSize)
    if (!sizeValidation.isValid) {
      return NextResponse.json({ error: sizeValidation.error }, { status: 400 })
    }

    // Generate file path
    const sanitizedName = sanitizeFileName(file.name)
    const filePath = generateFileName(sanitizedName, `bankbooks/${userId}`)

    // Convert file to buffer
    let buffer = Buffer.from(await file.arrayBuffer())

    // Compress if it's an image
    if (file.type.startsWith("image/")) {
      buffer = await compressImage(buffer, 85)
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from(STORAGE_BUCKETS.BANKBOOKS).upload(filePath, buffer, {
      contentType: file.type.startsWith("image/") ? "image/jpeg" : file.type,
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปโหลด" }, { status: 500 })
    }

    // Mask account number for security (show only last 4 digits)
    const maskedAccountNumber = accountNumber.replace(/\d(?=\d{4})/g, "*")

    // Save bankbook metadata to database
    const bankbookMetadata = {
      id: crypto.randomUUID(),
      user_id: userId,
      bank_name: bankName,
      account_number: accountNumber, // Store full number (encrypted in production)
      masked_account_number: maskedAccountNumber,
      file_path: filePath,
      file_size: buffer.length,
      file_type: file.type.startsWith("image/") ? "image/jpeg" : file.type,
      original_name: file.name,
      verification_status: "pending",
      created_at: new Date().toISOString(),
    }

    // Insert or update metadata in bankbooks table
    const { error: dbError } = await supabase.from("bankbooks").upsert(bankbookMetadata, {
      onConflict: "user_id",
    })

    if (dbError) {
      console.error("Database upsert error:", dbError)
      // Don't fail the upload if DB insert fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: bankbookMetadata.id,
        bankName: bankName,
        accountNumber: maskedAccountNumber,
        filePath: filePath,
        fileName: file.name,
        fileSize: buffer.length,
        verificationStatus: "pending",
        message: "สมุดบัญชีอัปโหลดสำเร็จ รอการตรวจสอบ",
      },
    })
  } catch (error) {
    console.error("Upload bankbook error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Bankbook Upload API",
    limits: FILE_LIMITS.BANKBOOK,
    bucket: STORAGE_BUCKETS.BANKBOOKS,
  })
}
