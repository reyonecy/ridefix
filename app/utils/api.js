export const loginUser = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.data.errors[0] || "Login failed. Please try again.");
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  };
  


  
  export const registerUser = async (userData) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/registerUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
  
      return { success: true };
    } catch (error) {
      console.error("Error during registration:", error.message);
      return { success: false, message: error.message };
    }
  };
  
  
  export const registerVehicle = async (vehicleData) => {
    try {
      const token = localStorage.getItem("userToken"); // Retrieve token
      if (!token) throw new Error("No token found, please log in.");
  
      console.log("Submitting vehicle data", vehicleData); // Log the sending
  
      const response = await fetch("http://localhost:5000/api/vehicles/addVehicle", {
        method: "POST", // Specify the HTTP method
        headers: {
          "Content-Type": "application/json", // Set the content type
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehicleData), // Convert the data to a JSON string
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails.message || response.statusText}`); // Handle response errors
      }
  
      const responseData = await response.json(); // Parse the JSON response
      console.log("Vehicle registered successfully", responseData);
  
      return responseData; // Return the response data
    } catch (error) {
      console.error("Failed to register vehicle", error.message);
      throw error; // Re-throw the error for further handling
    }
  };
   

export const vehicleDetailsList = async() =>{
  try{
    const token = localStorage.getItem("userToken");
  const response = await fetch("http://localhost:5000/api/vehicles/getVehicle",{
    method: "GET",
    headers:{
      "Content-Type":"application/json",
      Authorization: `Bearer ${token}`,
    }

  })

  if(!response.ok){
    throw new Error(`HTTP Error! Status: ${response.status}`);
  }
  const data = await response.json();
  console.log("Fetched Data:",data);
  return data
}
catch(error){
console.log("Error fetching data:", error.message)
  }
}


export const addRepairRequest = async (vehicleId, description, token) => {
  try {
  
    const response = await fetch(
      "http://localhost:5000/api/vehicles/addRepairRequest",
      {
        method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
        body: JSON.stringify({ vehicle_id: vehicleId, description }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error adding repair request:", error);
    throw error.response ? error.response.data : error;
  }
};