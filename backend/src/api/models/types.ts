export interface SelectModelRequest {
  modelName: string;
}

export interface ListModelsResponse {
  selectedModelName: string;
  modelNames: string[];
}
