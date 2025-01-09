"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/stores/useUserStore";

function Navbar() {
  const { user, clearUser } = useUserStore(); // Zustand state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

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
      router.push("/user"); // Redirect to user's home/profile page
    } else {
      router.push("/"); // Redirect to the landing page
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
            className="bg-red-500 px-4 py-2 rounded-sm text-white"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="relative dropdown">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="bg-primary-color px-4 py-2 rounded-sm"
          >
            Login
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-lg w-40">
              <Link
                href="/user/login"
                className="block px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Login
              </Link>
              <Link
                href="/user/register"
                className="block px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;
