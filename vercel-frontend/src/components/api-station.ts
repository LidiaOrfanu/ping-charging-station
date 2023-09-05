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

export interface UpdateStationResponse {
  id: number;
  name: string;
  location_id: number;
  availability: boolean;
}


export async function getAllStations(): Promise<ChargingStation[]> {
  const response = await fetch(`${API_BASE_URL}/stations`);
  const data = await response.json();
  return data;
}

// export async function updateStationName(
//   stationId: number,
//   updateData: UpdateStationNameRequest
// ): Promise<UpdateStationResponse> {
//   const response = await fetch(`${API_BASE_URL}/station/${stationId}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(updateData),
//   });

//   if (!response.ok) {
//     const errorMessage = await response.json();
//     throw new Error(errorMessage.message || "Failed to update station name");
//   }

//   const data: UpdateStationResponse = await response.json();
//   return data;
// }

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

