import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";

export const writeWord = async () => {
  let active: HTMLElement | null = document.querySelector<HTMLElement>(".dvoca.active");
  let questionsArray = document.querySelectorAll(".dvoca");
  let answeredNumber = 0;
  let vocabArr: string[] = JSON.parse(localStorage.getItem("vocab")!);
  while (questionsArray.length > answeredNumber) {
    let charArr = [];
    let charDiv = active!.querySelectorAll<HTMLElement>(".dstore li div");
    let trueVocab: string[] = [];
    for (const x of charDiv) {
      charArr.push(x.textContent);
    }
    for (const vocab of vocabArr) {
      if (vocab.length == charArr.length && vocab.toUpperCase().split("").sort().join() == charArr.sort().join()) {
        trueVocab = vocab.toUpperCase().split("");
      }
    }
    console.log(trueVocab);
    while (charDiv.length > 0) {
      l1: for (const x of trueVocab) {
        l2: for (const y of charDiv) {
          if (x == y.textContent) {
            await sleep(0.5);
            simulateMouseEvent(y, "click");
            charDiv = active!.querySelectorAll<HTMLElement>(".dstore li div");
            continue l1;
          }
        }
      }
    }
    await sleep(2);
    if (active != document.querySelector<HTMLElement>(".dvoca.active")) {
      answeredNumber++;
      active = document.querySelector<HTMLElement>(".dvoca.active");
    }
  }
};
