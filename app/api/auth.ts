import axios from "@/lib/config/axios";

export async function logoutAPI() {
  try {
    const response = await axios.get("/v1/accounts/logout");

    const data = response.data;

    return data;
  } catch (error) {
    return error;
  }
}

export async function getMeAPI() {
  try {
    const response = await axios.get("/v1/accounts/me");

    const data = response.data;

    return data;
  } catch (error) {
    return error;
  }
}

export async function sendPromptAPI(
  longitude: number,
  latitude: number,
  prompt: string,
) {
  try {
    const response = await axios.post("/v1/gpt", {
      current_longitude: longitude,
      current_latitude: latitude,
      prompt: prompt,
    });

    const data = response.data;

    return data;
  } catch (error) {
    return error;
  }
}
