"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/utils/api";
import { useUserStore } from "@/app/stores/useUserStore";
import Link from "next/link";

function Loginform() {
  const { setUser } = useUserStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = [];
    if (!formData.phone.trim()) {
      newErrors.push("Phone number is required.");
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.push("Phone number should be 10 digits.");
    }
    if (!formData.password.trim()) {
      newErrors.push("Password is required.");
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors([]); // Clear previous errors

    try {
      const data = await loginUser(formData);
      const { token, user } = data.data;
      setUser(user, token);
      router.push("/user");
    } catch (error) {
      setErrors([error.message || "An error occurred during login"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">User Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Please login to your account
          </p>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There were errors with your submission
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-color hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {/* Registration Link Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to our platform?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/user/register"
                className="w-full inline-flex justify-center py-2 px-4 border border-primary-color text-sm font-medium rounded-md text-primary-color hover:bg-primary-color hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Loginform;
