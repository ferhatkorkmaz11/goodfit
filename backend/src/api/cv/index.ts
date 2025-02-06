import express, { Request, Response } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import { retrieveValue, setKeyValue } from "../../database";
import { CV_KEY } from "./constants";
import { GetCVResponse, PatchCVRequest } from "./types";

const cvRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

cvRouter.post(
  "/",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    if (req.file.mimetype !== "application/pdf") {
      res.status(400).send("Only PDF files are allowed.");
      return;
    }
    try {
      const data = await pdfParse(req.file.buffer);
      setKeyValue(CV_KEY, data.text);
      res.send("File uploaded and processed successfully.");
    } catch (error) {
      res.status(500).send("Error processing PDF file.");
    }
  }
);

cvRouter.get("/", async (req: Request, res: Response) => {
  const curCV = retrieveValue(CV_KEY);
  const response: GetCVResponse = {
    cv: curCV ?? "",
  };
  res.json(response);
});

cvRouter.patch("/", async (req: Request, res: Response) => {
  const { cv }: PatchCVRequest = req.body;
  setKeyValue(CV_KEY, cv);
  res.json({ cv });
});

export default cvRouter;
