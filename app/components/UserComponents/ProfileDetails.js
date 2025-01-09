import { useEffect } from "react";
import { useUserStore } from "@/app/stores/useUserStore";

function ProfileDetails() {
  const { user, initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser(); // Initialize user data from localStorage
  }, []);

  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Phone:</strong> {user.phone}
      </p>
    </div>
  );
}

export default ProfileDetails;
