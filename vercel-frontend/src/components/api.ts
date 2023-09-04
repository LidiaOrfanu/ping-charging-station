import axios from "axios";

const API_BASE_URL = "https://ping-charging-station.shuttleapp.rs/api";

export interface ChargingStation {
  id: number;
  name: string;
  location_id: number;
  availability: boolean;
}
export interface StationResponse {
  data: {
    station: {
      id: number;
      name: string;
      location_id: number;
      availability: boolean;
    };
  };
  status: "success";
}

export interface ChargingStationLocation {
  id: number;
  street: string;
  zip: number;
  city: string;
  country: string;
}

export interface UpdateStationNameRequest {
  name: string;
}

export interface UpdateStationResponse {
  id: number;
  name: string;
  location_id: number;
  availability: boolean;
}

export interface ChargingStationLocationRequest {
  street: string;
  zip: number;
  city: string;
  country: string;
}

export async function getAllStations(): Promise<ChargingStation[]> {
  const response = await fetch(`${API_BASE_URL}/stations`);
  const data = await response.json();
  return data;
}

export async function updateStationName(
  stationId: number,
  updateData: UpdateStationNameRequest
): Promise<UpdateStationResponse> {
  const response = await fetch(`${API_BASE_URL}/station/${stationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage.message || "Failed to update station name");
  }

  const data: UpdateStationResponse = await response.json();
  return data;
}

export async function addStation(stationData: {
  name: string;
  location_id: number;
  availability: boolean;
}): Promise<StationResponse> {
  const response = await fetch(`${API_BASE_URL}/station`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stationData),
  });

  if (!response.ok) {
    throw new Error("Failed to add station");
  }

  return response.json();
}

export const addLocation = async (locationData: ChargingStationLocationRequest)=> {
    const response = await axios.post(
      `${API_BASE_URL}/location`,
      locationData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to add location - Status: ${response.status}`);
    }
};

export async function getAllLocations(): Promise<ChargingStationLocation[]> {
  const response = await fetch(`${API_BASE_URL}/locations`);
  const data = await response.json();
  return data;
}

export async function getStationByID(
  stationId: number
): Promise<ChargingStation> {
  const response = await axios.get(`${API_BASE_URL}/station/${stationId}`);
  return response.data.data.station as ChargingStation;
}

export async function deleteStationById(stationId: number): Promise<void> {
  const apiUrl = `${API_BASE_URL}/station/${stationId}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete station');
    }
  } catch (error) {
    throw new Error('Failed to delete station');
  }
}

export async function deleteLocationById(locationId: number): Promise<void> {
  console.log('deleteLocationById called');
  const apiUrl = `${API_BASE_URL}/location/${locationId}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
    });

    console.log('API Response:', response);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error data:', errorData); 
      throw new Error(errorData.message || 'Failed to delete location');
    }
  } catch (error) {
    console.error('Error:', error); 
    throw new Error('Failed to delete location');
  }
}