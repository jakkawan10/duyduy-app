import { v4 as uuidv4 } from "uuid"
import sharp from "sharp"

export interface FileValidationResult {
  isValid: boolean
  error?: string
}

export function validateFileType(file: File, allowedTypes: string[]): FileValidationResult {
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `ประเภทไฟล์ไม่ถูกต้อง อนุญาตเฉพาะ: ${allowedTypes.join(", ")}`,
    }
  }
  return { isValid: true }
}

export function validateFileSize(file: File, maxSize: number): FileValidationResult {
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024))
    return {
      isValid: false,
      error: `ไฟล์ใหญ่เกินไป ขนาดสูงสุด ${maxSizeMB}MB`,
    }
  }
  return { isValid: true }
}

export function generateFileName(originalName: string, prefix: string): string {
  const extension = originalName.split(".").pop()
  const timestamp = Date.now()
  const uuid = uuidv4().substring(0, 8)
  return `${prefix}/${timestamp}_${uuid}.${extension}`
}

export async function compressImage(buffer: Buffer, quality = 80): Promise<Buffer> {
  try {
    return await sharp(buffer)
      .jpeg({ quality, progressive: true })
      .resize(1920, 1080, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer()
  } catch (error) {
    console.error("Image compression failed:", error)
    return buffer // Return original if compression fails
  }
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase()
}
