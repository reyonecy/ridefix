"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/utils/api";
import { useUserStore } from "@/app/stores/useUserStore";
import Link from "next/link";

function Loginform() {
  const { setUser } = useUserStore(); // Accessing the Zustand store to set user details
  const router = useRouter();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number should be 10 digits.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const data = await loginUser(formData);
      const { token, user } = data.data;

      // Store token and user details in Zustand and localStorage
      setUser(user, token);

      // Redirect user to the user page
      console.log(user.data)
      router.push("/user");
    } catch (error) {
      setErrors({ api: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-md p-6 shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Login
      </h2>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 mb-2 font-medium">
          Phone number:
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Enter your number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-color"
        />
        {errors.phone && (
          <p className="text-red-500 mt-1 text-sm">{errors.phone}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-gray-700 font-medium mb-2"
        >
          Password:
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-color"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {errors.api && <p className="text-red-500 text-center mt-2">{errors.api}</p>}
      
      <button
        className={`bg-primary-color px-4 text-white py-2 rounded w-full ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-color-hover"
        }`}
        type="submit"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <div className="mt-2 ">
        <Link className="text-blue-500" href="/user/register">Create new account</Link>
       </div>
    </form>
  );
}

export default Loginform;
