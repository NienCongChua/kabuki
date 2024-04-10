import { getRandomNumber } from "../utils/getRandomNumber";
import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";

export const vocabulary = async (btnSubmit: HTMLElement) => {
  const vocabElementArr = document.querySelectorAll<HTMLElement>("h4");
  let vocabArr: string[] = [];
  if (localStorage.getItem("vocab") != null) vocabArr = JSON.parse(localStorage.getItem("vocab")!);
  console.log(vocabArr);
  vocabElementArr.forEach((v) => {
    v.querySelector<HTMLElement>(".daudio")?.click();
    const trimVocab = v.textContent!.trim();
    if (vocabArr.indexOf(trimVocab) == -1) vocabArr.push(trimVocab);
  });
  console.log("--------------------------------");
  console.log(vocabArr);
  localStorage.setItem("vocab", JSON.stringify(vocabArr));
  // sessionStorage.removeItem("vocab");
  // document.querySelectorAll<HTMLElement>(".daudio").forEach((element) => {
  //   element.setAttribute("muted", "muted");
  //   element.click();
  // });
  await sleep(getRandomNumber(3, 5));
  simulateMouseEvent(btnSubmit, "click");
  // setTimeout(() => btnSubmit.click(), getRandomNumber(3, 5) * 1000);
};
