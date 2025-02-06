import axios from "axios";
import {
  CheckJobCompatabilityRequest,
  CheckJobCompatabilityResponse,
  CV,
  ListModelsResponse,
  PickModelRequest,
} from "./types";

const API_URL = import.meta.env.API_URL || "http://localhost:8080";

export async function getCV(): Promise<CV> {
  try {
    console.log("API_URL:", API_URL);
    const response = await axios.get<CV>(`${API_URL}/cv`);
    return response.data;
  } catch (error) {
    console.error("Error fetching CV:", error);
    throw error;
  }
}

export async function patchCV(cv: CV): Promise<void> {
  try {
    await axios.patch(`${API_URL}/cv`, cv);
  } catch (error) {
    console.error("Error patching CV:", error);
    throw error;
  }
}

export async function listModels(): Promise<ListModelsResponse> {
  try {
    const response = await axios.get<ListModelsResponse>(`${API_URL}/models`);
    return response.data;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
}

export async function pickModel(
  pickModelRequest: PickModelRequest
): Promise<void> {
  try {
    await axios.post<PickModelRequest>(`${API_URL}/models`, pickModelRequest);
  } catch (error) {
    console.error("Error picking model:", error);
    throw error;
  }
}

export async function uploadCV(file: File): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    await axios.post(`${API_URL}/cv`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error uploading CV:", error);
    throw error;
  }
}

export async function checkJobCompatability(
  checkJobCompatabilityRequest: CheckJobCompatabilityRequest
): Promise<CheckJobCompatabilityResponse> {
  try {
    const response = await axios.post<CheckJobCompatabilityResponse>(
      `${API_URL}/check-job-compatability`,
      checkJobCompatabilityRequest
    );
    return response.data;
  } catch (error) {
    console.error("Error checking job compatibility:", error);
    throw error;
  }
}
