import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 'videos', 'id-cards', 'bankbooks'

    if (!userId) {
      return NextResponse.json({ error: "ต้องระบุ userId" }, { status: 400 })
    }

    let query = supabase.from("videos").select("*").eq("user_id", userId)

    if (type === "id-cards") {
      query = supabase.from("id_cards").select("*").eq("user_id", userId)
    } else if (type === "bankbooks") {
      query = supabase.from("bankbooks").select("*").eq("user_id", userId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Database query error:", error)
      return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    })
  } catch (error) {
    console.error("Get files error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("fileId")
    const type = searchParams.get("type")

    if (!userId || !fileId || !type) {
      return NextResponse.json({ error: "ต้องระบุ userId, fileId และ type" }, { status: 400 })
    }

    // Get file info from database
    let tableName = "videos"
    if (type === "id-cards") tableName = "id_cards"
    else if (type === "bankbooks") tableName = "bankbooks"

    const { data: fileData, error: fetchError } = await supabase
      .from(tableName)
      .select("file_path")
      .eq("id", fileId)
      .eq("user_id", userId)
      .single()

    if (fetchError || !fileData) {
      return NextResponse.json({ error: "ไม่พบไฟล์ที่ต้องการลบ" }, { status: 404 })
    }

    // Delete from storage
    const bucketName =
      type === "videos" ? "duyduy-videos" : type === "id-cards" ? "duyduy-id-cards" : "duyduy-bankbooks"

    const { error: storageError } = await supabase.storage.from(bucketName).remove([fileData.file_path])

    if (storageError) {
      console.error("Storage delete error:", storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase.from(tableName).delete().eq("id", fileId).eq("user_id", userId)

    if (dbError) {
      console.error("Database delete error:", dbError)
      return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "ลบไฟล์สำเร็จ",
    })
  } catch (error) {
    console.error("Delete file error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 })
  }
}
