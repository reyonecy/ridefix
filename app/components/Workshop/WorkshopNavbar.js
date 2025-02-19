"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWorkshopLoginStore } from "@/app/stores/useWorkshopStore";

export default function WorkshopNavbar() {
  const { workshop, clearWorkshop, initializeWorkshop } = useWorkshopLoginStore();
  const router = useRouter();

  useEffect(() => {
    initializeWorkshop();
  }, [initializeWorkshop]);

  // Logout handler
  const handleLogout = () => {
    clearWorkshop();
    router.push("/workshop/login");
  };

  // Redirect handler for RideFix logo
  const handleLogoClick = () => {
    if (workshop?.name) {
      router.push("/workshop");
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

      {workshop ? (
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-sm text-white hover:scale-110 transition-transform"
        >
          Logout
        </button>
      ) : (
        <div className="flex items-center gap-4">
          {/* User Login Button */}
          <Link
            href="/user/login"
            className="bg-secondary-color px-4 py-2 rounded-sm hover:scale-110 transition-transform"
          >
            User Login
          </Link>
          
          {/* Workshop Login Button */}
          <Link
            href="/workshop/login"
            className="bg-primary-color px-4 py-2 rounded-sm hover:scale-110 transition-transform"
          >
            Workshop Login
          </Link>
        </div>
      )}
    </div>
  );
}
