import express, { Request, Response } from "express";
import { retrieveValue, setKeyValue } from "../../database";
import { checkJobCompatability } from "../../service/ollama";
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
  const key = `${jobCompatiablityRequest.job.type}#${jobCompatiablityRequest.job.id}`;
  const cv = retrieveValue(CV_KEY);
  if (!cv) {
    res.status(400).send("CV not found.");
    return;
  }

  const model = retrieveValue(SELECTED_MODEL_NAME_KEY);
  if (!model) {
    res.status(400).send("Model not found.");
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
