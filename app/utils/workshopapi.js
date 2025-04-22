const BASE_URL = "http://localhost:5000/api/workshop";

export const registerWorkshop = async (data) => {
  try {
    console.log('Sending data:', data);
    const response = await fetch("http://localhost:5000/api/workshop/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the response contains error details
      return { success: false, message: responseData.message || "Registration failed. Please try again later." };
    }

    return responseData;
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error during registration:', error);
    return { success: false, message: error.message || "Something went wrong. Please try again later." };
  }
};

export const loginWorkshop = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Login failed",
        errors: data.data?.errors || ["Something went wrong"]
      };
    }

    // Store token and workshop data
    if (data.data?.token) {
      localStorage.setItem('workshop_token', data.data.token);
      localStorage.setItem('workshop_user', JSON.stringify(data.data.workshop));
    }

    return { ...data, success: true };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: "Connection error",
      errors: ["Unable to connect to server"]
    };
  }
};

// api for repair requests

export const getRepairLogs = async () => {
  try {
    const token = localStorage.getItem("workshop_token");

    // Check if token exists
    if (!token) {
      console.error("No token found");
      return { success: false, data: [], message: "No authentication token" };
    }

    const response = await fetch(`${BASE_URL}/getAllRepairRequest`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    // Log the actual response for debugging
    // console.log("Response from server:", {
    //   status: response.status,
    //   statusText: response.statusText,
    //   url: response.url
    // });

    if (!response.ok) {
      throw new Error(`Failed to fetch repair logs: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data || [] };
  } catch (error) {
    console.error("Error fetching repair logs:", error);
    return { success: false, data: [], message: error.message };
  }
};

export const acceptRepairRequest = async ({ repair_id }) => {
  try {
    const token = localStorage.getItem("workshop_token");
    
    const response = await fetch(`${BASE_URL}/acceptRepairRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      credentials: 'same-origin',
      body: JSON.stringify({ repair_id }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to accept repair request");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error accepting repair request:", error);
    return { 
      success: false, 
      message: error.message || "Failed to accept repair request" 
    };
  }
};

export const getAcceptedRepairLogs = async () => {
  try {
    const token = localStorage.getItem("workshop_token");

    const response = await fetch(`${BASE_URL}/getAcceptedRequest`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      credentials: 'same-origin',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch accepted repair logs: ${response.status}`);
    }

    const data = await response.json();
    console.log(data)
    return { success: true, data: data.data || [] };
  } catch (error) {
    console.error("Error fetching accepted repair logs:", error);
    return { success: false, data: [] };
  }
};

export const updateRepairRequest = async (repair_id, parts_used, extra_charges) => {
  try {
    const token = localStorage.getItem("workshop_token");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found"
      };
    }

    // Format and validate parts - now including quantity
    const formattedParts = Array.isArray(parts_used) ? parts_used.map(part => ({
      part_name: String(part.name || '').trim(),
      part_cost: parseInt(part.cost) || 0,
      quantity: parseInt(part.quantity) || 1  // Add quantity field, default to 1 if not specified
    })).filter(part => part.part_name && part.part_cost > 0) : [];

    // Format and validate charges
    const formattedCharges = Array.isArray(extra_charges) ? extra_charges.map(charge => ({
      charge_name: String(charge.description || '').trim(),
      charge_cost: parseInt(charge.amount) || 0
    })).filter(charge => charge.charge_name && charge.charge_cost > 0) : [];

    const requestBody = {
      repair_id: String(repair_id),
      parts_used: formattedParts,
      extra_charges: formattedCharges
    };

    console.log('Sending request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${BASE_URL}/updateRepairRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('Server response:', data);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to update repair request",
        error: data.error || null
      };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error("Error in updateRepairRequest:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later",
      error: error.message
    };
  }
};

export const generateBill = async (repair_id) => {
  try {
    const token = localStorage.getItem("workshop_token");
    if (!token) {
      return {
        success: false,
        message: "No authentication token found"
      };
    }

    const response = await fetch(`${BASE_URL}/generateBill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ repair_id })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to generate bill"
      };
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error("Error generating bill:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later"
    };
  }
};