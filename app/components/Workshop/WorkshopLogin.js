"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginWorkshop } from '@/app/utils/workshopapi';
import { useWorkshopLoginStore } from "@/app/stores/useWorkshopStore";

export const WorkshopLoginForm = () => {
  const router = useRouter();
  const { setWorkshop } = useWorkshopLoginStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateInput = () => {
    const newErrors = [];
    
    if (!formData.email.trim()) {
      newErrors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push("Invalid email format");
    }
    
    if (!formData.password) {
      newErrors.push("Password is required");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    
    if (!validateInput()) return;

    setIsLoading(true);
    try {
      const response = await loginWorkshop(formData);
      
      if (!response.success) {
        setErrors([response.message]);
        return;
      }

      // Update the global state with workshop data and token
      setWorkshop(response.data.workshop, response.data.token);
      router.push('/workshop');
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors(['An unexpected error occurred. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Workshop Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your workshop dashboard
          </p>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                {/* You can add an error icon here if desired */}
              </div>
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
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
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
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-color hover:bg-primary-color/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {/* You can add a loading spinner icon here */}
                </span>
              ) : null}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Registration Link Section */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to our platform?</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/workshop/register"
              className="w-full inline-flex justify-center py-2 px-4 border border-primary-color text-sm font-medium rounded-md text-primary-color hover:bg-primary-color hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            >
              Register Your Workshop
            </Link>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="font-medium text-primary-color hover:text-primary-color/90">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="font-medium text-primary-color hover:text-primary-color/90">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkshopLoginForm