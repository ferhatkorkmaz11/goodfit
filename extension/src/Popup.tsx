import { useEffect, useState } from "react";
import { getCV, listModels, patchCV, pickModel, uploadCV } from "./api";
import { CV, ListModelsResponse } from "./api/types";

function Popup() {
  const [cv, setCv] = useState<CV | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [cvText, setCvText] = useState<string>("");

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const cvData = await getCV();
        setCv(cvData);
        setCvText(cvData.cv);
      } catch (error) {
        console.error("Error fetching CV:", error);
      }
    };
    const fetchModels = async () => {
      try {
        const listModelsResponse: ListModelsResponse = await listModels();
        setModels(listModelsResponse.modelNames);
        setSelectedModel(listModelsResponse.selectedModelName);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };
    fetchCV();
    fetchModels();
  }, []);

  const handleUploadCV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      try {
        await uploadCV(event.target.files[0]);
        const cvData = await getCV();
        setCv(cvData);
        setCvText(cvData.cv);
      } catch (error) {
        console.error("Error uploading CV:", error);
      }
    }
  };

  const handlePatchCV = async () => {
    if (cv) {
      try {
        await patchCV({ ...cv, cv: cvText });
        const cvData = await getCV();
        setCv(cvData);
        setCvText(cvData.cv);
      } catch (error) {
        console.error("Error patching CV:", error);
      }
    }
  };

  const handleModelChange = async () => {
    if (selectedModel) {
      try {
        await pickModel({ modelName: selectedModel });
      } catch (error) {
        console.error("Error picking model:", error);
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-semibold text-center mb-8 text-blue-600">
        Good Fit
      </h1>
      <div className="flex flex-col items-center space-y-6 w-[500px] mx-auto">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CV
          </label>
          <input
            type="file"
            id="upload-cv-input"
            onChange={handleUploadCV}
            className="hidden"
            accept=".pdf"
          />
          <label
            htmlFor="upload-cv-input"
            className="block w-full p-3 bg-white border-2 border-dashed border-blue-500 text-blue-600 font-medium text-center rounded-lg cursor-pointer hover:bg-blue-50 transition-colors duration-200"
          >
            Choose File
          </label>
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Model
          </label>
          <select
            value={selectedModel || ""}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              handleModelChange();
            }}
            className="w-full p-3 bg-white text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Edit CV
          </label>
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            rows={10}
            className="w-full p-3 bg-white text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
          />
        </div>
        <button
          onClick={handlePatchCV}
          className="w-full p-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Save CV
        </button>
      </div>
    </div>
  );
}

export default Popup;
