import { createWorker } from "tesseract.js";
import { choice } from "./scripts/choice";
import { vocabulary } from "./scripts/vocabulary";
import { wait } from "./utils/wait";

let dtk = "";
const getTaskClassList = () => {
  return document.querySelector<HTMLElement>("#mbody")?.firstElementChild?.classList;
};

const mo = new MutationObserver(onMutation);
observe();

function onMutation() {
  let newDtk = document.querySelector<HTMLElement>("#mbody")!.getAttribute("dtk1")!.toString();
  if (dtk != newDtk) {
    dtk = newDtk;
    const btnSubmit = document.querySelector<HTMLElement>(`button[dtk2="${dtk}"]`);
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
          } else {
          }
          break;
        }
        case "dcontent": {
          wait(5);
          btnSubmit.click();
          break;
        }
        case "dmcq": {
          break;
        }
        default:
          break;
      }
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
