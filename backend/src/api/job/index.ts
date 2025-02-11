import { createHash } from "crypto";
import express, { Request, Response } from "express";
import { retrieveValue, setKeyValue } from "../../database";
import { checkJobCompatability, listModels } from "../../service/ollama";
import {
  CheckJobCompatabilityOllamaRequest,
  JobCompatiablity,
} from "../../service/ollama/types";
import { CV_KEY } from "../cv/constants";
import { SELECTED_MODEL_NAME_KEY } from "../models/constants";
import { CheckJobCompatabilityRequest } from "./types";

const jobRouter = express.Router();

jobRouter.post("/compatibility", async (req: Request, res: Response) => {
  const jobCompatiablityRequest: CheckJobCompatabilityRequest = req.body;

  const cv = retrieveValue(CV_KEY);
  if (!cv) {
    res.status(400).send("CV not found.");
    return;
  }
  const cvSHA256 = createHash("sha256").update(cv).digest("hex");

  let model = retrieveValue(SELECTED_MODEL_NAME_KEY);
  if (!model) {
    const models = await listModels();
    if (models.models.length === 0) {
      res.status(400).send("No models found.");
      return;
    }
    const ollamaModels = models.models.map((model) => {
      return model.name;
    });
    model = ollamaModels[0];
    setKeyValue(SELECTED_MODEL_NAME_KEY, model);
    res.status(400).send("Model not found.");
    return;
  }

  const models = await listModels();
  const ollamaModels = models.models.map((model) => {
    return model.name;
  });
  if (!ollamaModels.includes(model)) {
    model = ollamaModels[0];
    setKeyValue(SELECTED_MODEL_NAME_KEY, model);
  }

  const key = `${cvSHA256}#${jobCompatiablityRequest.job.type}#${jobCompatiablityRequest.job.id}#${model}`;
  const legacyJobCompatability = retrieveValue(key);

  if (legacyJobCompatability) {
    res.json(JSON.parse(legacyJobCompatability));
    return;
  }
  const jobCompatiablityOllamaRequest: CheckJobCompatabilityOllamaRequest = {
    jobDescription: jobCompatiablityRequest.job.description,
    cv: cv,
    model: model,
    jobTitle: jobCompatiablityRequest.job.title,
  };
  const jobCompatability: JobCompatiablity = await checkJobCompatability(
    jobCompatiablityOllamaRequest
  );
  setKeyValue(key, JSON.stringify(jobCompatability));
  res.json(jobCompatability);
});

export default jobRouter;
