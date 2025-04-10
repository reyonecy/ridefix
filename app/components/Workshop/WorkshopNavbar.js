"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWorkshopLoginStore } from "@/app/stores/useWorkshopStore";

export default function WorkshopNavbar() {
  const { workshop, logout } = useWorkshopLoginStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Initialize workshop data from localStorage if needed
    const storedWorkshop = localStorage.getItem('workshop_user');
    if (storedWorkshop) {
      useWorkshopLoginStore.getState().setWorkshop(JSON.parse(storedWorkshop));
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    logout();
    router.push("/workshop/login");
  };

  // Redirect handler for RideFix logo
  const handleLogoClick = () => {
    if (workshop?.name) {
      router.push("/workshop/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="bg-primary-background text-white h-20 flex items-center justify-between px-32">
      {/* Logo */}
      <div onClick={handleLogoClick} className="cursor-pointer">
        <h1 className="text-6xl text-primary-color font-semibold">RideFix</h1>
      </div>

      {/* Fix: Maintain consistent div structure */}
      <div className="flex items-center gap-4">
        {!isClient ? null : workshop?.name ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-sm text-white hover:scale-110 transition-transform"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              href="/user/login"
              className="bg-secondary-color px-4 py-2 rounded-sm hover:scale-110 transition-transform"
            >
              User Login
            </Link>
            
            <Link
              href="/workshop/login"
              className="bg-primary-color px-4 py-2 rounded-sm hover:scale-110 transition-transform"
            >
              Workshop Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

