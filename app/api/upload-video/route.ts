import { NextResponse } from 'next/server'
import nextConnect from 'next-connect'
import multer from 'multer'
import path from 'path'

// 1) ปิด bodyParser ของ Next.js เพราะ multer จะจัดการเอง
export const config = {
  api: { bodyParser: false }
}

// 2) ตั้ง storage ให้ multer เก็บที่ public/uploads/videos
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), 'public/uploads/videos'),
    filename: (_, file, cb) => {
      const unique = `${Date.now()}-${file.originalname}`
      cb(null, unique)
    }
  })
})

const apiRoute = nextConnect()
apiRoute.use(upload.single('file'))

apiRoute.post((req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  return res.status(200).json({
    filename: req.file.filename,
    url: `/uploads/videos/${req.file.filename}`
  })
})

export default apiRoute
