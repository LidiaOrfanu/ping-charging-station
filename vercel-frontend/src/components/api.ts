import axios from "axios";

const BASE_URL = 'https://ping-charging-station.shuttleapp.rs/api';

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
    status: 'success';
  }

export interface ChargingStationLocation {
    id: number;
    street: string;
    zip: number;
    city: string;
    country: string;
}
  
export async function addStation(stationData: {
  name: string;
  location_id: number;
  availability: boolean;
}): Promise<StationResponse> {
  const response = await fetch(`${BASE_URL}/station`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stationData),
  });

  if (!response.ok) {
    throw new Error('Failed to add station');
  }

  return response.json();
}

export async function getAllLocations(): Promise<ChargingStationLocation[]> {
    const response = await fetch(`${BASE_URL}/locations`);
    const data = await response.json();
    return data;
  }

  export async function getStationByID(stationId: number): Promise<ChargingStation> {
    const response = await axios.get(`${BASE_URL}/station/${stationId}`);
    return response.data.data.station as ChargingStation;
  }
  