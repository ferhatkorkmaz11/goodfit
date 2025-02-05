import axios from "axios";
import { OllamaModelsResponse } from "./types";

export async function listModels(): Promise<OllamaModelsResponse> {
  try {
    const response = await axios.get("http://localhost:11434/api/tags");
    return response.data as OllamaModelsResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch models: ${error.message}`);
    }
    throw new Error("Failed to fetch models");
  }
}
