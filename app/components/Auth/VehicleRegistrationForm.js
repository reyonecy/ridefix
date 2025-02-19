"use client";
import React, { useState } from "react";
import { registerVehicle } from "@/app/utils/api"; // Import the API service
import { useUserStore } from "@/app/stores/useUserStore"; // Assuming Zustand for state management

function VehicleRegistrationForm() {
  const { userToken } = useUserStore(); // Access user token from state management
  const [formData, setFormData] = useState({
    engine_number: "",
    chassis_number: "",
    reg_number: "",
    brand: "",
    color: "",
    model: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.engine_number.trim()) newErrors.engine_number = "Engine number is required.";
    if (!formData.chassis_number.trim()) newErrors.chassis_number = "Chassis number is required.";
    if (!formData.reg_number.trim()) newErrors.reg_number = "Registration number is required.";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required.";
    if (!formData.color.trim()) newErrors.color = "Color is required.";
    if (!formData.model.trim()) newErrors.model = "Model is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      if (!userToken) {
        setMessage("Authorization token is missing. Please log in.");
        setLoading(false);
        return;
      }

      console.log("Submitting vehicle data:", formData);
      const response = await registerVehicle(formData, userToken); // Call the API

      setMessage(response.message || "Vehicle registered successfully!");
      setFormData({
        engine_number: "",
        chassis_number: "",
        reg_number: "",
        brand: "",
        color: "",
        model: "",
      }); // Reset form
    } catch (error) {
      console.error("Error during vehicle registration:", error.message);
      setMessage(error.message || "Error registering vehicle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-auto">
      <h2 className="text-2xl font-bold mb-6">Register Vehicle</h2>

      {message && (
        <div
          className={`mb-4 p-4 ${
            message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {["engine_number", "chassis_number", "reg_number", "brand", "color", "model"].map((field) => (
          <div key={field}>
            <label className="block font-medium text-gray-700 capitalize">{field.replace("_", " ")}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md outline-none "
              required
            />
            {errors[field] && (
              <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className={`w-full bg-primary-color text-white py-2 rounded-md ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-color-hover"
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Register Vehicle"}
        </button>
      </form>
    </div>
  );
}

export default VehicleRegistrationForm;
