import express, { Request, Response } from "express";

const cvRouter = express.Router();

cvRouter.get("/", (req: Request, res: Response) => {
  res.send("cv");
});

export default cvRouter;
