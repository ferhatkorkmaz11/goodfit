import express, { Express, Request, Response } from "express";

const app: Express = express();

const port = process.env.PORT || 8080;

import cvRouter from "./api/cv";
import jobRouter from "./api/job";
import modelsRouter from "./api/models";

app.use(express.json());
app.use("/cv", cvRouter);
app.use("/models", modelsRouter);
app.use("/jobs", jobRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("hi");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
