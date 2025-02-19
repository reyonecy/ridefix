import { create } from "zustand";

export const useWorkshopLoginStore = create((set) => ({
  workshop: null,
  workshopToken: null,

  initializeWorkshop: () => {
    const workshopDetails = JSON.parse(localStorage.getItem("workshop_user")) || null;
    const workshopToken = localStorage.getItem("workshop_token") || null;
    set({ workshop: workshopDetails, workshopToken });
  },

  setWorkshop: (workshop, token) => {
    localStorage.setItem("workshop_user", JSON.stringify(workshop));
    localStorage.setItem("workshop_token", token);
    set({ workshop, workshopToken: token });
  },

  clearWorkshop: () => {
    localStorage.removeItem("workshop_user");
    localStorage.removeItem("workshop_token");
    set({ workshop: null, workshopToken: null });
  },
}));

export const useWorkshopRegisterStore = create((set) => ({
  formData: {
    name: "",
    email: "",
    phone: "",
    address: "",
    pan_no: "",
    reg_no: "",
    password: "",
  },
  errors: {},
  setFormData: (name, value) =>
    set((state) => ({
      formData: { ...state.formData, [name]: value },
    })),
  setErrors: (errors) => set(() => ({ errors })),
  clearErrors: () => set(() => ({ errors: {} })),
}));
