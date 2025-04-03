import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";
import { resetTimer } from "../utils/timerManager";

export const chooseWord = async () => {
  resetTimer();
  let active: HTMLElement | null = document.querySelector<HTMLElement>(".dvoca.active");
  let questionsArray = document.querySelectorAll(".dvoca");
  let answeredNumber = 0;
  while (questionsArray.length > answeredNumber) {
    let answers = active?.querySelectorAll<HTMLElement>(".dtitle");
    console.log(answers);
    for (const x of answers!) {
      simulateMouseEvent(x, "click");
      await sleep(2);
      if (active != document.querySelector<HTMLElement>(".dvoca.active")) {
        answeredNumber++;
        active = document.querySelector<HTMLElement>(".dvoca.active");
        break;
      }
    }
  }
  await sleep(1);
  // Tìm và click vào nút đóng của cửa sổ "Tôi không phải là robot"
  const closeButton = document.querySelector<HTMLElement>(".fa.fa-close");
  while (closeButton) {
    simulateMouseEvent(closeButton, "click");
    await sleep(2.2)
  }
};
