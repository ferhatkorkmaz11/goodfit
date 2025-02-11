import axios from "axios";
import { OLLAMA_API_URL } from "./constants";
import {
  CheckJobCompatabilityOllamaRequest,
  JobCompatiablity,
  OllamaModelsResponse,
} from "./types";

export async function listModels(): Promise<OllamaModelsResponse> {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/api/tags`);
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
    const params = {
      model: request.model,
      prompt: `Today's date is ${Date.now().toString()}This is the person's CV: ${
        request.cv
      }\n\nThis is the job title: ${
        request.jobTitle
      }\n\nThis is the job description: ${
        request.jobDescription
      }\n\nEvaluate if the person whose CV is given is a good fit for the job or not. You consider the seniority of the person and the job. For example, if the job requires 5 years of experience and the person has 2, give lower score. You should give a score between 0-100. You should be objective and evaluate all the possible aspects.\n\nProvide potential at least 3 interview questions long enough, if possible, give them as technical interview questions. \n\nProvide the output in JSON format with the following structure.`,
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
    };
    const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, params);

    return JSON.parse(response.data.response) as JobCompatiablity;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to check job compatibility: ${error.message}`);
    }
    throw new Error("Failed to check job compatibility");
  }
}
