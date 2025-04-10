import { create } from "zustand";
import { loginWorkshop, acceptRepairRequest, getAcceptedRepairLogs } from "@/app/utils/workshopapi";
import { useEffect } from "react";

// Modify the initialization function to handle SSR properly
const getInitialWorkshop = () => {
  // Don't try to access localStorage during SSR
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const stored = localStorage.getItem('workshop_user');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const useWorkshopFormStore = create((set) => ({
    formData: {
      name: "",
      email: "",
      phone: "",
      address: "",
      pan_no: "",
      reg_no: "",
      password: "",
    },
    errors: [],
    successMessage: "",
    setFormData: (name, value) =>
      set((state) => ({
        formData: {
          ...state.formData,
          [name]: value,
        },
      })),
    setErrors: (errors) => set({ errors }),
    setSuccessMessage: (message) => set({ successMessage: message }),
    resetFormData: () =>
      set({
        formData: {
          name: "",
          email: "",
          phone: "",
          address: "",
          pan_no: "",
          reg_no: "",
          password: "",
        },
      }),
  }));

export const useWorkshopLoginStore = create((set, get) => ({
    workshop: null,
    isLoading: false,
    error: null,
    
    setWorkshop: (workshop) => {
        if (workshop) {
            localStorage.setItem('workshop_user', JSON.stringify(workshop));
        }
        set({ workshop });
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await loginWorkshop(credentials);
            
            if (!response.success) {
                throw new Error(response.message || "Login failed");
            }

            // Ensure workshop data is properly set
            const workshopData = response.data.workshop;
            
            // Update store state with workshop data
            set({ 
                workshop: workshopData, 
                isLoading: false,
                error: null
            });

            // Store in localStorage
            localStorage.setItem('workshop_token', response.data.token);
            localStorage.setItem('workshop_user', JSON.stringify(workshopData));

            return { success: true };
        } catch (error) {
            set({ 
                workshop: null,
                error: error.message, 
                isLoading: false 
            });
            return { success: false, message: error.message };
        }
    },

    // Add a function to check login status
    checkLoginStatus: () => {
        const workshop = get().workshop;
        if (!workshop) {
            const stored = localStorage.getItem('workshop_user');
            if (stored) {
                set({ workshop: JSON.parse(stored) });
            }
        }
        return !!workshop;
    },

    logout: () => {
        localStorage.removeItem('workshop_token');
        localStorage.removeItem('workshop_user');
        set({ workshop: null, error: null });
    },

    // Add these new actions
    acceptRepairRequest: async (repair_id) => {
        try {
            const response = await acceptRepairRequest({ repair_id });
            if (response.success) {
                const currentLogs = get().repairLogs || [];
                const updatedLogs = currentLogs.map(log => 
                    log._id === repair_id 
                        ? { ...log, status: 'accepted' }
                        : log
                );
                set({ repairLogs: updatedLogs });
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (error) {
            console.error('Error accepting repair request:', error);
            return { success: false, message: 'Failed to accept repair request' };
        }
    },

    repairLogs: [], // Add this to store repair logs
    setRepairLogs: (logs) => set({ repairLogs: logs }),

    acceptedRepairLogs: [],
    setAcceptedRepairLogs: (logs) => set({ acceptedRepairLogs: logs }),

    fetchAcceptedRepairLogs: async () => {
        try {
            const response = await getAcceptedRepairLogs();
            if (response.success) {
                set({ acceptedRepairLogs: response.data });
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (error) {
            console.error('Error fetching accepted repair logs:', error);
            return { success: false, message: 'Failed to fetch accepted repair logs' };
        }
    },
}));

// Create a wrapper hook to handle initialization
export const useWorkshopStore = () => {
    const store = useWorkshopLoginStore();
    
    useEffect(() => {
        store.initializeWorkshop();
    }, []);
    
    return store;
};