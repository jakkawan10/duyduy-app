import { NextResponse } from 'next/server'
import nextConnect from 'next-connect'
import multer from 'multer'
import path from 'path'

export const config = {
  api: { bodyParser: false }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), 'public/uploads/ids'),
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
    url: `/uploads/ids/${req.file.filename}`
  })
})

export default apiRoute
