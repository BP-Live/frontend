import axios from "@/lib/config/axios";

export async function googleAuthAPI() {
  try {
    const response = await axios.get("/v1/accounts/google");

    const data = response.data;

    return data;
  } catch (error) {
    console.error(error);

    return error;
  }
}

export async function logoutAPI() {
  try {
    const response = await axios.get("/v1/accounts/logout");

    const data = response.data;

    return data;
  } catch (error) {
    console.error(error);

    return error;
  }
}

export async function getMeAPI() {
  try {
    const response = await axios.get("/v1/accounts/me");

    const data = response.data;

    return data;
  } catch (error) {
    console.error(error);

    return error;
  }
}
