import { imageChoice } from "./scripts/imageChoice";

let dtk: string;
const getTaskClassList = () => {
  return document.querySelector<HTMLElement>("#mbody")?.firstElementChild?.classList;
};

const mo = new MutationObserver(onMutation);
observe();

async function onMutation() {
  let newDtk = document.querySelector<HTMLElement>("#mbody")?.getAttribute("dtk1");
  if (dtk != newDtk) {
    dtk = newDtk!;
    const btnSubmit = document.querySelector<HTMLElement>(`button[dtk2="${dtk}"]`);
    if (btnSubmit && !btnSubmit.hasAttribute("disabled")) {
      const classList = getTaskClassList();
      const taskType = classList!.item(0)!.toString();
      mo.disconnect();
      console.log(taskType);
      switch (taskType) {
        // case "dvocabulary": {
        //   vocabulary(btnSubmit);
        //   break;
        // }
        // case "dquestion": {
        //   if (classList?.contains("choose-reading-choose-answer")) {
        //     await wordChoice(btnSubmit);
        //   } else {
        //     await filling(btnSubmit);
        //   }
        //   break;
        // }
        // case "dcontent": {
        //   await sleep(30);
        //   btnSubmit.click();
        //   break;
        // }
        case "dmcq": {
          await imageChoice();
          console.log("hi");
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
  console.log(request);
});
