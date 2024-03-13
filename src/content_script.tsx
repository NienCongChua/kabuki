import { filling } from "./scripts/filling";
import { imageChoice } from "./scripts/imageChoice";
import { vocabulary } from "./scripts/vocabulary";
import { wordChoice } from "./scripts/wordChoice";
import { sleep } from "./utils/sleep";

let dtk = "";
const getTaskClassList = () => {
  return document.querySelector<HTMLElement>("#mbody")?.firstElementChild?.classList;
};

const mo = new MutationObserver(onMutation);
observe();

async function onMutation() {
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
            await wordChoice(btnSubmit);
          } else {
            await filling(btnSubmit);
          }
          break;
        }
        case "dcontent": {
          sleep(5);
          btnSubmit.click();
          break;
        }
        case "dmcq": {
          document.querySelectorAll("audio").forEach((x) => (x.muted = true));
          await imageChoice();
          console.log("hi");
          break;
        }
        case "dupload": {
          await sleep(5);
          btnSubmit.click();
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

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {});
