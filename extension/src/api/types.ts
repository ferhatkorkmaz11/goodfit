export interface InterviewQuestion {
  question: string;
  answer: string;
}

export interface CheckJobCompatabilityResponse {
  fitRate: number;
  explanation: string;
  possibleAreasToWorkOn: string[];
  potentialInterviewQuestions: InterviewQuestion[];
}

export interface Job {
  id: string;
  title: string;
  description: string;
  type: string;
}
export interface CheckJobCompatabilityRequest {
  job: Job;
}

export interface PickModelRequest {
  modelName: string;
}

export interface ListModelsResponse {
  selectedModelName: string;
  modelNames: string[];
}

export interface CV {
  cv: string;
}
