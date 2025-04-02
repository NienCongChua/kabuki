import { getRandomNumber } from "../utils/getRandomNumber";
import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";

export const vocabulary = async (btnSubmit: HTMLElement) => {
  const vocabElementArr = document.querySelectorAll<HTMLElement>("h4");
  let vocabArr: string[] = [];
  if (localStorage.getItem("vocab") != null) vocabArr = JSON.parse(localStorage.getItem("vocab")!);
  vocabElementArr.forEach((v) => {
    v.querySelector<HTMLElement>(".daudio")?.click();
    let trimVocab = v.textContent!.trim();
    trimVocab = trimVocab.replace(/\s*\([^)]*\)$/, "");
    console.log(trimVocab);
    if (vocabArr.indexOf(trimVocab) == -1) vocabArr.push(trimVocab);
  });
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
