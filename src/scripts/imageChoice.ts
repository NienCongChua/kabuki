import { sleep } from "../utils/sleep";

export const imageChoice = async () => {
  let active: HTMLElement | null = document.querySelector<HTMLElement>(".dvoca.active");
  let questionsArray = document.querySelectorAll(".dvoca");
  let answeredNumber = 0;
  while (questionsArray.length > answeredNumber) {
    let answers = active?.querySelectorAll<HTMLElement>(".dtitle");
    console.log(answers);
    for (const x of answers!) {
      x.dispatchEvent(
        new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        }),
      );
      await sleep(3);
      if (active != document.querySelector<HTMLElement>(".dvoca.active")) {
        answeredNumber++;
        active = document.querySelector<HTMLElement>(".dvoca.active");
        break;
      }
    }
  }
};
