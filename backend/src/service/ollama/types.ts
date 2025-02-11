export interface ModelDetails {
  parent_model: string;
  format: string;
  family: string;
  families: string[];
  parameter_size: string;
  quantization_level: string;
}

export interface Model {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: ModelDetails;
}

export interface OllamaModelsResponse {
  models: Model[];
}

export interface PotentialInterviewQuestion {
  question: string;
  answer: string;
}
export interface JobCompatiablity {
  fitRate: number;
  explanation: string;
  possibleAreasToWorkOn: string[];
  potentialInterviewQuestions: PotentialInterviewQuestion[];
}

export interface CheckJobCompatabilityOllamaRequest {
  cv: string;
  jobDescription: string;
  model: string;
  jobTitle: string;
}
