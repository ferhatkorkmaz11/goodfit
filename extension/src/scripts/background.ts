import { checkJobCompatability } from "../api";
import { CheckJobCompatabilityRequest } from "../api/types";
import { DISPLAY_RESULTS, GET_JOB_DETAILS } from "./constants";

console.log("Background script loaded");
function checkActiveTabForLinkedInJobs() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0 || !tabs[0]?.url) return;

    const activeTab = tabs[0];
    if (activeTab.url?.includes("linkedin.com/jobs")) {
      chrome.tabs.sendMessage(
        activeTab.id!,
        { action: GET_JOB_DETAILS },
        async (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error sending message to content script:",
              chrome.runtime.lastError
            );
            return;
          }

          if (response) {
            const checkJobCompatabilityRequest: CheckJobCompatabilityRequest = {
              job: {
                id: response.id,
                title: response.title,
                description: response.description,
                type: "linkedin",
              },
            };
            const compatibilityResponse = await checkJobCompatability(
              checkJobCompatabilityRequest
            );

            chrome.tabs.sendMessage(activeTab.id!, {
              action: DISPLAY_RESULTS,
              data: compatibilityResponse,
            });
          }
        }
      );
    }
  });
}

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("linkedin.com/jobs")
  ) {
    checkActiveTabForLinkedInJobs();
  }
});
