import { create } from "zustand";
import { vehicleDetailsList } from "../utils/api";
import { useUserStore } from "./useUserStore";

export const useVehicleStore = create((set) => ({
  vehicles: [],
  loading: false,
  error: null,

  fetchVehicles: async () => {
    const { userToken } = useUserStore.getState(); // Get userToken from the user store
    if (!userToken) {
      set({ error: "User is not authenticated", loading: false });
      return;
    }

    set({ loading: true, error: null }); // Set loading state before fetch

    try {
      const data = await vehicleDetailsList(userToken); // Fetch data using API function
      if (data.success) {
        set({ vehicles: data.data, loading: false }); // Update vehicles and stop loading
      } else {
        set({ error: data.message, loading: false }); // Handle API-level errors
      }
    } catch (err) {
      set({ error: err.message, loading: false }); // Handle other errors
    }
  },
}));
