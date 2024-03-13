import { sleep } from "../utils/sleep";
export const imageChoice = async () => {
  let active: HTMLElement;
  const numberOfQues = document.querySelectorAll<HTMLElement>(".dvoca").length;
  const answeredQues = [];
  while (answeredQues.length != numberOfQues) {
    let currentActive = document.querySelector<HTMLElement>(".dvoca.active")!;
    active = currentActive;
    const allCurrentAns = active.querySelectorAll<HTMLElement>(".dans a");
    for (let i = 0; i < allCurrentAns.length; i++) {
      allCurrentAns[i].click();
      await sleep(5);
      if (allCurrentAns[i].style.borderColor == "red") {
        continue;
      }
      break;
    }
    answeredQues.push(active);
    await sleep(5);
  }
};
