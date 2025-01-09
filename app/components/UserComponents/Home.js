"use client";
import React from "react";
import { useUserStore } from "@/app/stores/useUserStore";

function Home() {
  const { user } = useUserStore();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        Hello, {user?.name || "User"}!
      </h1>
      <p className="text-lg mt-4">Welcome to your dashboard.</p>
    </div>
  );
}

export default Home;
