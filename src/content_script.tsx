import { createWorker } from "tesseract.js";
import { choice } from "./scripts/choice";
import { vocabulary } from "./scripts/vocabulary";

const getTaskClassList = () => {
  return document.querySelector<HTMLElement>("#mbody")?.firstElementChild?.classList;
};

const mo = new MutationObserver(onMutation);
observe();

function onMutation() {
  const btnSubmit = document.querySelector<HTMLElement>("#submit564f801509");
  if (btnSubmit && !btnSubmit.hasAttribute("disabled")) {
    const classList = getTaskClassList();
    const taskType = classList!.item(0)!.toString();
    mo.disconnect();
    console.log(taskType);
    switch (taskType) {
      case "dvocabulary": {
        vocabulary(btnSubmit);
        break;
      }
      case "dquestion": {
        if (classList?.contains("choose-reading-choose-answer")) {
          choice(btnSubmit);
        }
        break;
      }
      default:
        break;
    }
    observe();
  }
}

function observe() {
  mo.observe(document, {
    subtree: true,
    childList: true,
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const inputArr = document.querySelectorAll<HTMLElement>(".danw");
  inputArr.forEach(async (inputElement) => {
    const base64Img = inputElement.style.backgroundImage.slice(4, -1).replace(/"/g, "");
    const worker = await createWorker("eng");
    const ret = await worker.recognize(base64Img);
    console.log(ret.data.text);
  });
});
