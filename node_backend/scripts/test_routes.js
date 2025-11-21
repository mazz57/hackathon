const axios = require("axios");

const API_URL = "http://localhost:5002/api";

const testAuth = async () => {
  try {
    console.log("Testing Registration...");
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: "Test User",
      phone: "1234567890",
      password: "password123",
    });
    console.log("Registration Success:", registerRes.data);
    return registerRes.data;
  } catch (error) {
    if (
      error.response &&
      error.response.data.message === "User already exists"
    ) {
      console.log("User already exists, trying login...");
      return await testLogin();
    }
    console.error(
      "Registration Failed:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const testLogin = async () => {
  try {
    console.log("Testing Login...");
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      phone: "1234567890",
      password: "password123",
    });
    console.log("Login Success:", loginRes.data);
    return loginRes.data;
  } catch (error) {
    console.error(
      "Login Failed:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const testSOS = async (token) => {
  try {
    console.log("Testing SOS...");
    const sosRes = await axios.post(
      `${API_URL}/sos/trigger`,
      {
        location: {
          lat: 28.7041,
          lon: 77.1025,
        },
        triggerType: "manual",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("SOS Success:", sosRes.data);
  } catch (error) {
    console.error(
      "SOS Failed:",
      error.response ? error.response.data : error.message
    );
  }
};

const runTests = async () => {
  try {
    const user = await testAuth();
    if (user && user.token) {
      await testSOS(user.token);
    }
  } catch (error) {
    console.error("Tests failed");
  }
};

runTests();
