"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/UserComponents/Sidebar";
import Home from "@/app/components/UserComponents/Home";
import ProfileDetails from "@/app/components/UserComponents/ProfileDetails";
import VehicleRegistrationForm from "@/app/components/Auth/VehicleRegistrationForm";
import { useUserStore } from "@/app/stores/useUserStore";
import VehicleDetails from "../components/UserComponents/VehicleDetails";
import Footer from "../components/shared/Footer";
function ProfilePage() {
  const [selected, setSelected] = useState("home"); // Default to "home"
  const { user } = useUserStore();

  return (
    <div className="flex h-screen">
      <Sidebar selected={selected} setSelected={setSelected} />
      <div className="w-3/4 p-6">
        {selected === "home" && <Home />}
        {selected === "profile" && <ProfileDetails user={user} />}
        {selected === "register" && <VehicleRegistrationForm />}
        {selected === "vehicledetail" && <VehicleDetails/>}
      </div>
      
    </div>
  );
}

export default ProfilePage;
