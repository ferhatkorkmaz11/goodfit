import express, { Request, Response } from "express";
import db from "../../database";
import { listModels } from "../../service/ollama";
import { OllamaModelsResponse } from "../../service/ollama/types";
import { SELECTED_MODEL_NAME_KEY } from "./constants";
import { ListModelsResponse, SelectModelRequest } from "./types";

const modelsRouter = express.Router();

modelsRouter.get("/", async (req: Request, res: Response) => {
  const models: OllamaModelsResponse = await listModels();
  const selectedModel = db
    .prepare("SELECT * FROM GoodFitKeyValuePairs WHERE key = ?")
    .get(SELECTED_MODEL_NAME_KEY) as { value: string } | undefined;
  const selectedModelName = selectedModel ? selectedModel.value : "";
  const modelNames = models.models.map((model) => model.name);
  const response: ListModelsResponse = {
    selectedModelName,
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
  const curModel = db
    .prepare("SELECT * FROM GoodFitKeyValuePairs WHERE key = ?")
    .get(SELECTED_MODEL_NAME_KEY);
  if (curModel) {
    db.prepare("UPDATE GoodFitKeyValuePairs SET value = ? WHERE key = ?").run(
      modelName,
      SELECTED_MODEL_NAME_KEY
    );
  } else {
    db.prepare(
      "INSERT INTO GoodFitKeyValuePairs (key, value) VALUES (?, ?)"
    ).run(SELECTED_MODEL_NAME_KEY, modelName);
  }
  res.json({ modelName });
});

export default modelsRouter;
