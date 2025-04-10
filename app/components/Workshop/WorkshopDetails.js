"use client";
import { useEffect } from "react";
import { useWorkshopLoginStore } from "@/app/stores/useWorkshopStore";
import { useRouter } from 'next/navigation';

function WorkshopDetails() {
  const { workshop, checkLoginStatus } = useWorkshopLoginStore();
  const router = useRouter();

  useEffect(() => {
    // Check login status when component mounts
    if (!checkLoginStatus()) {
      router.push('/workshop/login');
    }
  }, []);

  if (!workshop) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
      {workshop && (
        <>
          <p className="text-xl">
            <strong>Name:</strong> {workshop.name}
          </p>
          <p className="text-xl">
            <strong>Email:</strong> {workshop.email}
          </p>
          <p className="text-xl">
            <strong>Phone:</strong> {workshop.phone}
          </p>
          <p className="text-xl">
            <strong>Address:</strong> {workshop.address}
          </p>
        </>
      )}
    </div>
  );
}

export default WorkshopDetails;
