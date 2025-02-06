import axios from "axios";
import {
  CheckJobCompatabilityOllamaRequest,
  JobCompatiablity,
  OllamaModelsResponse,
} from "./types";

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

export async function checkJobCompatability(
  request: CheckJobCompatabilityOllamaRequest
): Promise<JobCompatiablity> {
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: request.model,
      prompt: `This is the person's CV: ${request.cv}\n\nThis is the job title: ${request.jobTitle}\n\nThis is the job description: ${request.jobDescription}\n\nEvaluate if the person whose CV is given is a good fit for the job or not. You should give a score between 0-100. You should be objective and evaluate all the possible aspects.\n\nProvide the output in JSON format with the following structure.`,
      stream: false,
      format: {
        type: "object",
        properties: {
          fitRate: { type: "integer" },
          explanation: { type: "string" },
          possibleAreasToWorkOn: {
            type: "array",
            items: { type: "string" },
          },
          potentialInterviewQuestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                answer: { type: "string" },
              },
              required: ["question", "answer"],
            },
          },
        },
        required: [
          "fitRate",
          "explanation",
          "possibleAreasToWorkOn",
          "potentialInterviewQuestions",
        ],
      },
    });

    return JSON.parse(response.data.response) as JobCompatiablity;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to check job compatibility: ${error.message}`);
    }
    throw new Error("Failed to check job compatibility");
  }
}
