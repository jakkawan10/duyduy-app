# DUYDUY Backend API

ระบบหลังบ้านสำหรับแอป DUYDUY รองรับการอัปโหลดไฟล์ 3 ประเภท:
- วิดีโอ (สูงสุด 100MB, 60 วินาที)
- บัตรประชาชน (สูงสุด 10MB, รูปภาพ)
- สมุดธนาคาร (สูงสุด 10MB, รูปภาพ/PDF)

## 🚀 การติดตั้ง

### 1. Clone และติดตั้ง dependencies
\`\`\`bash
git clone <repository-url>
cd duyduy-backend
npm install
\`\`\`

### 2. ตั้งค่า Supabase
1. สร้างโปรเจกต์ใหม่ที่ [supabase.com](https://supabase.com)
2. ไปที่ Settings > API เพื่อดู URL และ Keys
3. สร้าง Storage Buckets:
   - `duyduy-videos` (Public)
   - `duyduy-id-cards` (Private)
   - `duyduy-bankbooks` (Private)

### 3. ตั้งค่า Environment Variables
\`\`\`bash
cp .env.example .env.local
# แก้ไขค่าใน .env.local
\`\`\`

### 4. สร้างตารางฐานข้อมูล
\`\`\`bash
# รันคำสั่ง SQL ใน scripts/create-tables.sql ใน Supabase SQL Editor
\`\`\`

### 5. รันเซิร์ฟเวอร์
\`\`\`bash
npm run dev
\`\`\`

## 📡 API Endpoints

### Upload Video
\`\`\`
POST /api/upload-video
Content-Type: multipart/form-data

Fields:
- file: Video file (MP4, MOV, AVI)
- userId: User ID
- title: Video title (optional)
- description: Video description (optional)
\`\`\`

### Upload ID Card
\`\`\`
POST /api/upload-id
Content-Type: multipart/form-data

Fields:
- file: Image file (JPEG, PNG, WebP)
- userId: User ID
- side: 'front' or 'back'
\`\`\`

### Upload Bankbook
\`\`\`
POST /api/upload-bankbook
Content-Type: multipart/form-data

Fields:
- file: Image/PDF file
- userId: User ID
- bankName: Bank name
- accountNumber: Account number
\`\`\`

### Get User Files
\`\`\`
GET /api/files/[userId]?type=videos|id-cards|bankbooks
\`\`\`

### Delete File
\`\`\`
DELETE /api/files/[userId]?fileId=xxx&type=videos|id-cards|bankbooks
\`\`\`

### Health Check
\`\`\`
GET /api/health
\`\`\`

## 🔒 ความปลอดภัย

- ตรวจสอบประเภทและขนาดไฟล์
- บีบอัดรูปภาพอัตโนมัติ
- เข้ารหัสชื่อไฟล์
- Row Level Security (RLS) ใน Supabase
- ไม่เปิดเผย URL ของเอกสารส่วนตัว

## 🚀 Deploy บน Vercel

1. Push โค้ดขึ้น GitHub
2. เชื่อมต่อ repository กับ Vercel
3. ตั้งค่า Environment Variables ใน Vercel Dashboard
4. Deploy!

## 📊 การใช้งาน Storage

- Supabase: 2GB ฟรี
- Vercel Functions: 100GB-hours/เดือน ฟรี
- Bandwidth: 100GB/เดือน ฟรี

## 🛠️ การพัฒนาต่อ

- เพิ่มระบบ Authentication
- เพิ่มการตรวจสอบเนื้อหาด้วย AI
- เพิ่มระบบ CDN สำหรับวิดีโอ
- เพิ่มการแปลงไฟล์วิดีโอ
