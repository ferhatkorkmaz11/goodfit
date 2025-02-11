import express, { Request, Response } from "express";
import { retrieveValue, setKeyValue } from "../../database";
import { listModels } from "../../service/ollama";
import { OllamaModelsResponse } from "../../service/ollama/types";
import { SELECTED_MODEL_NAME_KEY } from "./constants";
import { ListModelsResponse, SelectModelRequest } from "./types";

const modelsRouter = express.Router();

modelsRouter.get("/", async (req: Request, res: Response) => {
  const models: OllamaModelsResponse = await listModels();
  const selectedModel = retrieveValue(SELECTED_MODEL_NAME_KEY);
  const modelNames = models.models.map((model) => model.name);
  const response: ListModelsResponse = {
    selectedModelName: selectedModel ?? "",
    modelNames,
  };
  res.json(response);
});

modelsRouter.post("/", async (req: Request, res: Response) => {
  const { modelName }: SelectModelRequest = req.body;
  const models: OllamaModelsResponse = await listModels();
  const modelNames = models.models.map((model) => model.name);
  if (!modelNames.includes(modelName)) {
    res.status(400).json({ error: "Invalid model name" });
    return;
  }
  setKeyValue(SELECTED_MODEL_NAME_KEY, modelName);
  res.json({ modelName });
});

export default modelsRouter;
