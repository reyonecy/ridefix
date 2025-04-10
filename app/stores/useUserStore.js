import { create } from "zustand";



export const useUserStore = create((set) => ({
  user: null,
  userToken: null,

  initializeUser: () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails")) || null;
    const userToken = localStorage.getItem("userToken") || null;
    set({ user: userDetails, userToken });
  },

  setUser: (user, token) => {
    localStorage.setItem("userDetails", JSON.stringify(user));
    localStorage.setItem("userToken", token);
    set({ user, userToken: token });
  },

  clearUser: () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("userToken");
    set({ user: null, userToken: null });
  },
}));




export const useRegisterStore = create((set) => ({
    formData: {
      f_name: "",
      m_name: "",
      l_name: "",
      password: "",
      address: "",
      phone: "",
      email: "",
    },
    errors: {},
    setFormData: (name, value) =>
      set((state) => ({
        formData: { ...state.formData, [name]: value },
      })),
    setErrors: (errors) => set(() => ({ errors })),
    clearErrors: () => set(() => ({ errors: {} })),
  }));

