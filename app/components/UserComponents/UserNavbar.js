"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/stores/useUserStore";

export default function UserNavbar() {
  const { user, clearUser } = useUserStore();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userDetails");
    clearUser();
    router.push("/user/login");
  };

  // Redirect handler for RideFix logo
  const handleLogoClick = () => {
    if (user?.name) {
      router.push("/user");
    } else {
      router.push("/");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Close dropdown with Escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div className="bg-primary-background text-white h-20 flex items-center justify-between px-32">
      {/* Handle logo click */}
      <div onClick={handleLogoClick} className="cursor-pointer">
        <h1 className="text-6xl text-primary-color font-semibold">RideFix</h1>
      </div>

      {/* Show user details if logged in */}
      {user?.name ? (
        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-sm text-white hover:scale-110 transition-transform"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {/* Workshop Login Button */}
          <Link
            href="/workshop/login"
            className="bg-secondary-color px-4 py-2 rounded-sm hover:scale-110 transition-transform"
          >
            Workshop Login
          </Link>
          
          {/* User Login Dropdown */}
          <div className="relative dropdown">
            <button
              onClick={() => router.push("/user/login")}
              className="bg-primary-color px-4 py-2 rounded-sm hover:scale-110 transition-transform"
            >
              Login
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
}


