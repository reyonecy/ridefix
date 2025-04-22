const BASE_URL = "http://localhost:5000/api"; // Adjust the base URL if needed

export const getUserRepairs = async (status = '') => {
  try {
    const token = localStorage.getItem("userToken");
    const url = `${BASE_URL}/vehicles/getUserRepairs${status ? `?status=${status}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user repairs: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data || [] };
  } catch (error) {
    console.error("Error fetching user repairs:", error);
    return { success: false, data: [], message: error.message };
  }
};

export const getBill = async (bill_id) => {
  console.log("Fetching bill for ID in bill ids:", bill_id);
  try {
    const token = localStorage.getItem("userToken"); // Assuming user token is stored here
console.log("Token is:", token)
    const response = await fetch(`${BASE_URL}/payment/getBill?bill_id=${bill_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log(data)
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch bill details");
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error("Error fetching bill details:", error);
    return { success: false, message: error.message };
  }
};
