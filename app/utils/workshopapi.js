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
    const response = await fetch("http://localhost:5000/api/workshop/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

    // Store token in localStorage
    if (data.data?.token) {
      localStorage.setItem('workshop_token', data.data.token);
      localStorage.setItem('workshop_user', JSON.stringify(data.data.workshop));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: "Connection error",
      errors: ["Unable to connect to server"]
    };
  }
};
