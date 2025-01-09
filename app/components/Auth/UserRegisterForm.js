"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useRegisterStore } from "@/app/stores/useUserStore";
import { registerUser } from "@/app/utils/api";

function Registerform() {
  const router = useRouter();
  const { formData, errors, setFormData, setErrors, clearErrors } = useRegisterStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.f_name) newErrors.f_name = "First name is required";
    if (!formData.l_name) newErrors.l_name = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Invalid phone number length";
    }
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    if (validateForm()) {
      const result = await registerUser(formData);
      if (result.success) {
        alert("Registration successful!");
        router.push("./login");
      } else {
        alert(result.message || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="f_name"
            value={formData.f_name}
            onChange={handleInputChange}
            placeholder="Enter your first name"
            className="w-full p-2 border rounded"
          />
          {errors.f_name && <p className="text-red-500 text-sm">{errors.f_name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Middle Name (Optional)</label>
          <input
            type="text"
            name="m_name"
            value={formData.m_name}
            onChange={handleInputChange}
            placeholder="Enter your middle name"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="l_name"
            value={formData.l_name}
            onChange={handleInputChange}
            placeholder="Enter your last name"
            className="w-full p-2 border rounded"
          />
          {errors.l_name && <p className="text-red-500 text-sm">{errors.l_name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            className="w-full p-2 border rounded"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your address"
            className="w-full p-2 border rounded"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <button type="submit" className="w-full bg-primary-color text-white py-2 rounded mt-4">
          Register
        </button>
      </form>
    </div>
  );
}

export default Registerform;
