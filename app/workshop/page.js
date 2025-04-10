"use client";
import { useState } from "react";
import WorkshopSidebar from "@/app/components/Workshop/WorkshopSidebar";
import WorkshopHome from "@/app/components/Workshop/WorkshopHome";
import WorkshopDetails from "@/app/components/Workshop/WorkshopDetails";
import { useWorkshopLoginStore } from "@/app/stores/useWorkshopStore";
import AcceptedRequests from "../components/Workshop/AcceptedRequests";

export default function WorkshopPage() {
  const [selected, setSelected] = useState("workshophome");
  const { workshop } = useWorkshopLoginStore();

  if (!workshop) {
    return <div>Please log in to access this page.</div>;
  }

  const renderContent = () => {
    switch (selected) {
      case "workshophome":
        return <WorkshopHome />;
      case "workshopdetails":
        return <WorkshopDetails />;
      case "acceptedrequests":
        return <AcceptedRequests/>; // Create this component
      case "register":
        return <div>Register Vehicle</div>; // Create this component
      default:
        return <WorkshopHome />;
    }
  };

  return (
    <div className="flex h-screen">
      <WorkshopSidebar selected={selected} setSelected={setSelected} />
      <div className="w-3/4 p-6">
        {renderContent()}
      </div>
    </div>
  );
}
