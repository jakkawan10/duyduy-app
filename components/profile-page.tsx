"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Settings,
  Upload,
  Shield,
  CheckCircle,
  AlertCircle,
  Video,
  Heart,
  Eye,
  TrendingUp,
  Camera,
  Edit,
  LogOut,
  Trash2,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const [isKYCVerified, setIsKYCVerified] = useState(false)
  const [displayName, setDisplayName] = useState("ผู้ใช้ DUYDUY")
  const [username, setUsername] = useState("duyduy_user")
  const [bio, setBio] = useState("สร้างคอนเทนต์คุณภาพ | รักการทำอาหาร | เที่ยวทั่วไทย 🇹🇭")

  const userStats = {
    followers: 15420,
    following: 892,
    videos: 47,
    totalLikes: 125600,
    totalEarnings: 125600,
    monthlyEarnings: 8750,
  }

  const userVideos = Array.from({ length: 12 }).map((_, index) => ({
    id: index + 1,
    title: `วิดีโอ #${index + 1}`,
    views: Math.floor(Math.random() * 10000) + 1000,
    likes: Math.floor(Math.random() * 1000) + 100,
    earnings: Math.floor(Math.random() * 1000) + 100,
    thumbnail: `/placeholder.svg?height=300&width=200`,
  }))

  const [showKYCDialog, setShowKYCDialog] = useState(false)
  const [kycStep, setKycStep] = useState(1)
  const [kycData, setKycData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    username: "",
    idCardFront: null as File | null,
    idCardBack: null as File | null,
  })

  return (
    <div className="min-h-screen bg-[#e5f7f6] pb-20">
      {/* Header */}
      <div className="bg-[#42d3d1] text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">โปรไฟล์</h1>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Settings className="w-6 h-6" />
          </Button>
        </div>

        {/* Profile Header */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-2xl bg-white text-[#42d3d1]">{displayName[0]}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-[#42d3d1] hover:bg-white/90 rounded-full"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          <h2 className="text-xl font-bold mb-1">{displayName}</h2>
          <p className="text-white/80 mb-2">@{username}</p>

          {/* KYC Status */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {isKYCVerified ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">ยืนยันตัวตนแล้ว</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">ยังไม่ได้ยืนยันตัวตน</span>
              </>
            )}
          </div>

          <p className="text-white/90 text-sm max-w-sm mx-auto">{bio}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-xl font-bold">{userStats.followers.toLocaleString()}</div>
            <div className="text-sm text-white/80">ผู้ติดตาม</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{userStats.following.toLocaleString()}</div>
            <div className="text-sm text-white/80">กำลังติดตาม</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{userStats.videos}</div>
            <div className="text-sm text-white/80">วิดีโอ</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* KYC Card */}
        {!isKYCVerified && (
          <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-yellow-600" />
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-800">ยืนยันตัวตนเพื่อปลดล็อกฟีเจอร์</h3>
                  <p className="text-sm text-yellow-700">อัปโหลดวิดีโอและถอนรายได้ได้หลังยืนยันตัวตน</p>
                </div>
                <Dialog open={showKYCDialog} onOpenChange={setShowKYCDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">เริ่มยืนยัน</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-center">ยืนยันตัวตนและสมัครสมาชิก</DialogTitle>
                    </DialogHeader>

                    {/* KYC Steps Content */}
                    {kycStep === 1 && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-blue-600" />
                          </div>
                          <h3 className="font-bold text-lg mb-2">ขั้นตอนที่ 1: ข้อมูลบัญชี</h3>
                          <p className="text-sm text-gray-600">กรอกข้อมูลสำหรับสร้างบัญชี DUYDUY</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="email">อีเมล</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="example@email.com"
                              value={kycData.email}
                              onChange={(e) => setKycData({ ...kycData, email: e.target.value })}
                              className="bg-white"
                            />
                          </div>

                          <div>
                            <Label htmlFor="displayName">ชื่อที่แสดง</Label>
                            <Input
                              id="displayName"
                              placeholder="ชื่อจริงของคุณ"
                              value={kycData.displayName}
                              onChange={(e) => setKycData({ ...kycData, displayName: e.target.value })}
                              className="bg-white"
                            />
                          </div>

                          <div>
                            <Label htmlFor="username">ชื่อผู้ใช้ (@username)</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                @
                              </span>
                              <Input
                                id="username"
                                placeholder="username"
                                value={kycData.username}
                                onChange={(e) => setKycData({ ...kycData, username: e.target.value })}
                                className="bg-white pl-8"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="password">รหัสผ่าน</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="รหัสผ่านอย่างน้อย 8 ตัวอักษร"
                              value={kycData.password}
                              onChange={(e) => setKycData({ ...kycData, password: e.target.value })}
                              className="bg-white"
                            />
                          </div>

                          <div>
                            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="กรอกรหัสผ่านอีกครั้ง"
                              value={kycData.confirmPassword}
                              onChange={(e) => setKycData({ ...kycData, confirmPassword: e.target.value })}
                              className="bg-white"
                            />
                          </div>
                        </div>

                        <Button
                          className="w-full bg-[#42d3d1] hover:bg-[#3bc4c2] text-white"
                          onClick={() => setKycStep(2)}
                          disabled={
                            !kycData.email ||
                            !kycData.password ||
                            !kycData.displayName ||
                            !kycData.username ||
                            kycData.password !== kycData.confirmPassword
                          }
                        >
                          ถัดไป: ถ่ายรูปบัตรประชาชน
                        </Button>
                      </div>
                    )}

                    {kycStep === 2 && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Camera className="w-8 h-8 text-green-600" />
                          </div>
                          <h3 className="font-bold text-lg mb-2">ขั้นตอนที่ 2: ยืนยันตัวตน</h3>
                          <p className="text-sm text-gray-600">ถ่ายรูปบัตรประชาชนหน้า-หลังเพื่อยืนยันตัวตน</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label>บัตรประชาชนด้านหน้า</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#42d3d1] transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(e) => setKycData({ ...kycData, idCardFront: e.target.files?.[0] || null })}
                                className="hidden"
                                id="idCardFront"
                              />
                              <label htmlFor="idCardFront" className="cursor-pointer">
                                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">แตะเพื่อถ่ายรูปด้านหน้า</p>
                                {kycData.idCardFront && <p className="text-xs text-green-600 mt-1">✓ อัปโหลดแล้ว</p>}
                              </label>
                            </div>
                          </div>

                          <div>
                            <Label>บัตรประชาชนด้านหลัง</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#42d3d1] transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(e) => setKycData({ ...kycData, idCardBack: e.target.files?.[0] || null })}
                                className="hidden"
                                id="idCardBack"
                              />
                              <label htmlFor="idCardBack" className="cursor-pointer">
                                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">แตะเพื่อถ่ายรูปด้านหลัง</p>
                                {kycData.idCardBack && <p className="text-xs text-green-600 mt-1">✓ อัปโหลดแล้ว</p>}
                              </label>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <div className="text-xs text-yellow-800">
                                <p className="font-medium mb-1">คำแนะนำการถ่ายรูป:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  <li>ถ่ายในที่แสงสว่างเพียงพอ</li>
                                  <li>บัตรต้องชัดเจน อ่านข้อความได้</li>
                                  <li>ไม่มีแสงสะท้อนหรือเงา</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setKycStep(1)}>
                            ย้อนกลับ
                          </Button>
                          <Button
                            className="flex-1 bg-[#42d3d1] hover:bg-[#3bc4c2] text-white"
                            onClick={() => setKycStep(3)}
                            disabled={!kycData.idCardFront || !kycData.idCardBack}
                          >
                            ถัดไป: ตรวจสอบ
                          </Button>
                        </div>
                      </div>
                    )}

                    {kycStep === 3 && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-purple-600" />
                          </div>
                          <h3 className="font-bold text-lg mb-2">ขั้นตอนที่ 3: ตรวจสอบข้อมูล</h3>
                          <p className="text-sm text-gray-600">ตรวจสอบข้อมูลก่อนส่งยืนยันตัวตน</p>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-medium text-sm text-gray-700 mb-2">ข้อมูลบัญชี</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">อีเมล:</span>
                                <span>{kycData.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">ชื่อที่แสดง:</span>
                                <span>{kycData.displayName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">ชื่อผู้ใช้:</span>
                                <span>@{kycData.username}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-medium text-sm text-gray-700 mb-2">เอกสารยืนยันตัวตน</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">บัตรประชาชนหน้า:</span>
                                <span className="text-green-600">✓ อัปโหลดแล้ว</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">บัตรประชาชนหลัง:</span>
                                <span className="text-green-600">✓ อัปโหลดแล้ว</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="text-xs text-blue-800">
                                <p className="font-medium mb-1">การรักษาความปลอดภัย:</p>
                                <p>ข้อมูลของคุณจะถูกเข้ารหัสและเก็บอย่างปลอดภัย ใช้เฉพาะการยืนยันตัวตนเท่านั้น</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setKycStep(2)}>
                            แก้ไข
                          </Button>
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                              setIsKYCVerified(true)
                              setShowKYCDialog(false)
                              setKycStep(1)
                              // Reset form
                              setKycData({
                                email: "",
                                password: "",
                                confirmPassword: "",
                                displayName: "",
                                username: "",
                                idCardFront: null,
                                idCardBack: null,
                              })
                            }}
                          >
                            ยืนยันและสมัครสมาชิก
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Earnings Card */}
        <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-300 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="w-5 h-5" />
              รายได้ของคุณ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-green-600">฿{userStats.totalEarnings.toLocaleString()}</div>
                <div className="text-sm text-gray-600">รายได้ทั้งหมด</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-600">฿{userStats.monthlyEarnings.toLocaleString()}</div>
                <div className="text-sm text-gray-600">เดือนนี้</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>เพิ่มขึ้น 15% จากเดือนที่แล้ว</span>
            </div>
          </CardContent>
        </Card>

        {/* Create Video Button */}
        <Button
          className="w-full bg-[#ff6c63] hover:bg-[#ff5a50] text-white py-4 text-lg font-semibold mb-6"
          disabled={!isKYCVerified}
        >
          <Upload className="w-5 h-5 mr-2" />
          สร้างวิดีโอใหม่
        </Button>

        {/* Content Tabs */}
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80">
            <TabsTrigger value="videos">วิดีโอ ({userStats.videos})</TabsTrigger>
            <TabsTrigger value="settings">ตั้งค่า</TabsTrigger>
            <TabsTrigger value="help">ช่วยเหลือ</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-3 gap-2">
              {userVideos.map((video) => (
                <div
                  key={video.id}
                  className="relative aspect-[9/16] bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="flex items-center justify-between text-xs text-white mb-1">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{video.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{video.likes}</span>
                      </div>
                    </div>
                    <div className="text-xs text-green-400">฿{video.earnings}</div>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6 space-y-6">
            {/* Profile Settings */}
            <Card className="bg-white/80 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  แก้ไขโปรไฟล์
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ชื่อที่แสดง</label>
                  <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ชื่อผู้ใช้</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-white" />
                  <div className="text-xs text-gray-500 mt-1">เปลี่ยนได้ 1 ครั้งต่อ 30 วัน</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">แนะนำตัว</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-white"
                    rows={3}
                    maxLength={150}
                  />
                  <div className="text-xs text-gray-500 mt-1">{bio.length}/150 ตัวอักษร</div>
                </div>
                <Button className="w-full bg-[#42d3d1] hover:bg-[#3bc4c2] text-white">บันทึกการเปลี่ยนแปลง</Button>
              </CardContent>
            </Card>

            {/* Creator Settings */}
            <Card className="bg-white/80 border-0">
              <CardHeader>
                <CardTitle>การตั้งค่าผู้สร้าง</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">รับเหรียญ ❤️</div>
                    <div className="text-sm text-gray-500">เปิด/ปิดการรับเหรียญจากผู้ชม</div>
                  </div>
                  <Button variant="outline" size="sm">
                    เปิด
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">บัญชีธนาคาร</div>
                    <div className="text-sm text-gray-500">สำหรับถอนรายได้</div>
                  </div>
                  <Button variant="outline" size="sm">
                    เพิ่ม
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="bg-white/80 border-0">
              <CardHeader>
                <CardTitle>ความปลอดภัย</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  เปลี่ยนรหัสผ่าน
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  ตั้งค่า 2-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  จัดการอุปกรณ์ที่เข้าสู่ระบบ
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">โซนอันตราย</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  ออกจากระบบ
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  ลบบัญชี
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="mt-6">
            <Card className="bg-white/80 border-0">
              <CardHeader>
                <CardTitle>ศูนย์ช่วยเหลือ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  คำถามที่พบบ่อย (FAQ)
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  วิธีการใช้งาน
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  นโยบายความเป็นส่วนตัว
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  เงื่อนไขการใช้งาน
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  ติดต่อทีมงาน
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
