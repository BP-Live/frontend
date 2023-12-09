// Define a type for the location object
type Location = {
  lat: number;
  lng: number;
};

// Function to save location to local storage
export const saveLocation = (location: Location): void => {
  const data = {
    location,
    timestamp: new Date().getTime(), // Current time in milliseconds
  };
  localStorage.setItem("userLocation", JSON.stringify(data));
};

// Function to get the location from local storage
export const getLocation = (): Location | null => {
  const data = localStorage.getItem("userLocation");
  if (!data) return null;

  const parsedData = JSON.parse(data);
  const currentTime = new Date().getTime();

  // Check if the data is older than 15 minutes (900000 milliseconds)
  if (currentTime - parsedData.timestamp > 900000) {
    localStorage.removeItem("userLocation");
    return null;
  }

  return parsedData.location;
};
