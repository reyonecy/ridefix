"use client";
import React from "react";
import { useWorkshopFormStore } from "@/app/stores/useWorkshopStore";
import { registerWorkshop } from "@/app/utils/workshopapi";
import { useRouter } from "next/navigation";
export const WorkshopRegisterForm = () => {
  const router = useRouter();
  const {
    formData,
    errors,
    successMessage,
    setFormData,
    setErrors,
    setSuccessMessage,
    resetFormData,
  } = useWorkshopFormStore();

  const validateInput = () => {
    const newErrors = [];
    const passwordRegex = /(?=(.*[0-9]))(?=.*[!@#$%^&*()\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z])).{8,}/;

    if (!formData.name.trim()) newErrors.push("Name is required.");
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.push("Valid email is required.");
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) newErrors.push("Valid 10-digit phone number is required.");
    if (!formData.address.trim()) newErrors.push("Address is required.");
    if (!formData.pan_no.trim()) newErrors.push("PAN number is required.");
    if (!formData.reg_no.trim()) newErrors.push("Registration number is required.");
    if (!passwordRegex.test(formData.password)) newErrors.push("Password must include one uppercase letter, one lowercase letter, one number, and one special character.");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(name, value.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage("");

    if (!validateInput()) return;

    try {
      const response = await registerWorkshop(formData);
      console.log('Registration response:', response);
      if (response.success) {
        setSuccessMessage(response.message);
        resetFormData();
        router.push("/workshop/login");
      } else {
        if (response.errors) {
          setErrors(response.errors);
        } else if (response.message) {
          setErrors([response.message]);
        } else {
          setErrors(["Something went wrong. Please try again later."]);
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrors(["Something went wrong. Please try again later."]);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-4">Workshop Registration</h2>

      {successMessage && (
        <p className="text-green-500 text-center mb-4" role="alert">
          {successMessage}
        </p>
      )}

      {errors.length > 0 && (
        <ul className="list-disc list-inside text-red-500 mb-4" role="alert">
          {errors.map((error, index) => (
            <li key={index} >{error}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:border-black sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-black sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm  outline-none focus:border-black sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:border-black sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="pan_no" className="block text-sm font-medium text-gray-700">
            PAN Number
          </label>
          <input
            type="text"
            id="pan_no"
            name="pan_no"
            placeholder="PAN Number"
            value={formData.pan_no}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:border-black sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="reg_no" className="block text-sm font-medium text-gray-700">
            Registration Number
          </label>
          <input
            type="text"
            id="reg_no"
            name="reg_no"
            placeholder="Registration Number"
            value={formData.reg_no}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:border-black sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:border-black sm:text-sm"
          />
        </div>

        <button
          type="submit"
         
          className="w-full py-2 px-4 bg-primary-color text-white font-medium rounded-md hover:scale-105 transition-transform focus:outline-none  outline-none  "
        >
          Register
        </button>
      </form>
    </div>
  );
};