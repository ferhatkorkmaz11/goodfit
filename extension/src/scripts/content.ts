import { CheckJobCompatabilityResponse, Job } from "../api/types";

console.log("Content script loaded");

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "GET_JOB_DETAILS") {
    insertWaitingBanner();
    setTimeout(() => {
      const jobDetails: Job = getJobDetailsFromDOM();
      sendResponse(jobDetails);
    }, 500);
    return true;
  }
  if (message.action === "DISPLAY_RESULTS") {
    displayResults(message.data);
  }
});

function insertWaitingBanner() {
  if (document.querySelector(".good-fit-container")) {
    return;
  }
  const resultContainer = document.querySelector(".good-fit-container-result");
  if (resultContainer) {
    resultContainer.remove();
  }

  const elements = [...document.querySelectorAll("*")].filter(
    (el) => el.className === "job-details-module"
  );

  if (elements.length === 0) {
    return;
  }

  const container = document.createElement("div");
  container.className = "good-fit-container";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.gap = "10px";
  container.style.padding = "20px";
  container.style.marginTop = "15px";
  container.style.border = "2px solid rgb(37 99 235)";
  container.style.borderRadius = "12px";
  container.style.backgroundColor = "rgb(251 249 250)";
  container.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";

  const goodFitLogo = document.createElement("img");
  goodFitLogo.src =
    "https://goodfit-main-bucket.s3.eu-central-1.amazonaws.com/icon512.png";
  goodFitLogo.width = 128;
  goodFitLogo.height = 128;
  goodFitLogo.style.borderRadius = "8px";
  goodFitLogo.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.2)";

  const heading = document.createElement("h1");
  heading.className = "good-fit-classname";
  heading.textContent = "Waiting for compatibility results 🤖 📝";
  heading.style.color = "#364153";
  heading.style.fontSize = "22px";
  heading.style.fontWeight = "600";
  heading.style.fontFamily = "'Outfit', sans-serif";
  heading.style.textAlign = "center";
  heading.style.padding = "5px 10px";

  container.appendChild(goodFitLogo);
  container.appendChild(heading);

  elements[0].appendChild(container);
}

function getJobDetailsFromDOM(): Job {
  const titleElement = document.querySelector(
    ".job-details-jobs-unified-top-card__job-title"
  );
  const descriptionElement = document.querySelector(
    ".jobs-description__container"
  );

  if (!titleElement || !descriptionElement) {
    console.error("Could not findd job details on page");
    return {
      id: "",
      title: "",
      description: "",
      type: "linkedin",
    };
  }

  const description = descriptionElement.textContent;
  const currentJobIdMatch = document.URL.match(/currentJobId=(\d+)/);
  const directJobViewMatch = document.URL.match(/jobs\/view\/(\d+)/);
  const id = currentJobIdMatch
    ? currentJobIdMatch[1]
    : directJobViewMatch
    ? directJobViewMatch[1]
    : "";
  const title = titleElement.textContent;
  return {
    id: id,
    title: title || "",
    description: description || "",
    type: "linkedin",
  };
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e"; // green
  if (score >= 60) return "#f97316"; // orange
  return "#ef4444"; // red
}

function displayResults(
  checkJobCompatabilityResponse: CheckJobCompatabilityResponse
) {
  const goodFitContainer = document.querySelector(".good-fit-container");
  const goodFitContainerResult = document.querySelector(
    ".good-fit-container-result"
  );
  if (goodFitContainer) goodFitContainer.remove();
  if (goodFitContainerResult) goodFitContainerResult.remove();

  const container = document.createElement("div");
  container.className = "good-fit-container-result";
  Object.assign(container.style, {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "24px",
    marginTop: "15px",
    border: "2px solid rgb(37 99 235)",
    borderRadius: "12px",
    backgroundColor: "rgb(251 249 250)",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "800px",
    margin: "15px auto",
  });

  const scoreColor = getScoreColor(checkJobCompatabilityResponse.fitRate);

  const header = document.createElement("div");
  Object.assign(header.style, {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  });

  const goodFitLogo = document.createElement("img");
  goodFitLogo.src =
    "https://goodfit-main-bucket.s3.eu-central-1.amazonaws.com/icon512.png";
  goodFitLogo.width = 64;
  goodFitLogo.height = 64;
  goodFitLogo.style.borderRadius = "8px";

  const scoreSection = document.createElement("div");
  scoreSection.innerHTML = `
    <h1 style="margin: 0; color: ${scoreColor}; font-size: 32px; font-weight: 700;">
      ${checkJobCompatabilityResponse.fitRate}%
    </h1>
    <p style="margin: 0; color: #64748b; font-size: 16px;">Job Fit Score</p>
  `;

  header.appendChild(goodFitLogo);
  header.appendChild(scoreSection);

  const explanation = document.createElement("p");
  explanation.textContent = checkJobCompatabilityResponse.explanation;
  Object.assign(explanation.style, {
    color: "#364153",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0",
  });

  const createCollapsible = (title: string, content: HTMLElement) => {
    const details = document.createElement("details");
    const summary = document.createElement("summary");

    Object.assign(details.style, {
      borderRadius: "8px",
      backgroundColor: "#f8fafc",
      padding: "12px",
      transition: "all 0.3s ease",
    });

    Object.assign(summary.style, {
      cursor: "pointer",
      fontWeight: "600",
      color: "#1e293b",
      padding: "4px",
      userSelect: "none",
    });

    summary.textContent = title;
    details.appendChild(summary);
    details.appendChild(content);

    details.addEventListener("toggle", () => {
      if (details.open) {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.opacity = "1";
      } else {
        content.style.maxHeight = "0";
        content.style.opacity = "0";
      }
    });

    return details;
  };

  const areasContent = document.createElement("div");
  const areasList = document.createElement("ul");
  checkJobCompatabilityResponse.possibleAreasToWorkOn.forEach((area) => {
    const li = document.createElement("li");
    li.textContent = area;
    li.style.marginBottom = "8px";
    areasList.appendChild(li);
  });
  areasContent.appendChild(areasList);
  Object.assign(areasContent.style, {
    transition: "all 0.3s ease",
    maxHeight: "0",
    opacity: "0",
    overflow: "hidden",
    paddingTop: "12px",
  });

  const questionsContent = document.createElement("div");
  checkJobCompatabilityResponse.potentialInterviewQuestions.forEach(
    (q, index) => {
      const qDiv = document.createElement("div");
      qDiv.innerHTML = `
      <p style="font-weight: 600; margin: 0 0 8px 0;">Q${index + 1}: ${
        q.question
      }</p>
      <p style="color: #64748b; margin: 0 0 16px 0;">${q.answer}</p>
    `;
      questionsContent.appendChild(qDiv);
    }
  );
  Object.assign(questionsContent.style, {
    transition: "all 0.3s ease",
    maxHeight: "0",
    opacity: "0",
    overflow: "hidden",
    paddingTop: "12px",
  });

  const areasSection = createCollapsible("Areas to Improve ↓", areasContent);
  const questionsSection = createCollapsible(
    "Practice Interview Questions ↓",
    questionsContent
  );

  container.appendChild(header);
  container.appendChild(explanation);
  container.appendChild(areasSection);
  container.appendChild(questionsSection);

  let elements = [...document.querySelectorAll("*")].filter(
    (el) => el.className === "job-details-module"
  );
  if (elements.length === 0) {
    elements = [...document.querySelectorAll(".jobs-description__container")];
    if (elements.length === 0) {
      console.log("Could not find job details container");
    }
  }
  elements[0].appendChild(container);
}
