"use client"

import { useState } from "react"
import HomePage from "@/components/home-page"
import DiscoverPage from "@/components/discover-page"
import WalletPage from "@/components/wallet-page"
import ProfilePage from "@/components/profile-page"
import BottomNavigation from "@/components/bottom-navigation"

export default function DuyDuyApp() {
  const [currentPage, setCurrentPage] = useState("home")

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} />
      case "discover":
        return <DiscoverPage />
      case "wallet":
        return <WalletPage />
      case "profile":
        return <ProfilePage />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-[#e5f7f6]">
      {renderCurrentPage()}
      <BottomNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  )
}
