import { chooseAnswer } from "./scripts/chooseAnswer";
import { chooseWord } from "./scripts/chooseWord";
import { fillBlank } from "./scripts/fillBlank";
import { vocabulary } from "./scripts/vocabulary";

const getTaskClassList = () => {
  return document.querySelector<HTMLElement>("#mbody")?.firstElementChild?.classList;
};

async function onMutation(dtk: string) {
  const btnSubmit = document.querySelector<HTMLElement>(`button[dtk2="${dtk}"]`);
  if (btnSubmit && !btnSubmit.hasAttribute("disabled")) {
    const classList = getTaskClassList();
    const taskType = classList!.item(1)!.toString();
    console.log(taskType);
    if (taskType == "default") vocabulary(btnSubmit);
    if (taskType == "audio-write-word") console.log("Audio write word");
    if (taskType == "fill-reading-word-blank" || taskType == "fill-listening-write-answer") fillBlank(btnSubmit);
    if (taskType == "choose-listening-choose-answer" || taskType == "choose-reading-choose-answer")
      chooseAnswer(btnSubmit);
    if (taskType == "view-content") btnSubmit.click();
    if (taskType == "upload-content") console.log("Upload");
    if (taskType == "image-choose-word" || taskType == "audio-choose-word") chooseWord();
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const dtk = request.id;
  onMutation(dtk);
  // if (document.querySelector<HTMLElement>("#mbody")?.getAttribute("dtk1") != dtk) window.location.reload();
});
