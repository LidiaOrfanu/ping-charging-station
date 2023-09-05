import axios from "axios";

const API_BASE_URL = "https://ping-charging-station.shuttleapp.rs/api";

export interface ChargingStationLocation {
  id: number;
  street: string;
  zip: number;
  city: string;
  country: string;
}
export interface ChargingStationLocationRequest {
  street?: string;
  zip?: number;
  city?: string;
  country?: string;
}

export const addLocation = async (locationData: ChargingStationLocationRequest) => {
    const response = await axios.post(
      `${API_BASE_URL}/location`,
      locationData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
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

export async function deleteLocationById(locationId: number): Promise<void> {
  const apiUrl = `${API_BASE_URL}/location/${locationId}`;

    const response = await fetch(apiUrl, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete location');
    }
}

export async function updateLocationById(id: number | null, data: ChargingStationLocationRequest): Promise<ChargingStationLocation> {
    const response = await axios.patch(`${API_BASE_URL}/api/location/${id}`, data);
    return response.data.data.location as ChargingStationLocation;

}