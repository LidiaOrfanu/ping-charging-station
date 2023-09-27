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
export interface UpdateChargingStationRequest {
  name?: string;
  availability?: boolean | null;
}

export async function getAllStations(): Promise<ChargingStation[]> {
  const response = await fetch(`${API_BASE_URL}/stations`);
  const data = await response.json();
  return data;
}

export async function addStation(stationData: {
  name: string;
  location_id: number;
  availability: boolean;
}): Promise<StationResponse> {
  const response = await fetch(`${API_BASE_URL}/stations`, {
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

export async function getStationByID(
  stationId: number
): Promise<ChargingStation> {
  const response = await axios.get(`${API_BASE_URL}/station/${stationId}`);
  return response.data.data.station as ChargingStation;
}

export async function deleteStationById(stationId: number): Promise<void> {
  const apiUrl = `${API_BASE_URL}/station/${stationId}`;

    const response = await fetch(apiUrl, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete station');
    }
}

export async function updateStationById(id: number | null, data: UpdateChargingStationRequest): Promise<ChargingStation> {
  const response = await axios.patch(`${API_BASE_URL}/station/${id}`, data);
  return response.data.location as ChargingStation;

}