import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";
import { resetTimer, getTimerState } from "../utils/timerManager";

export const chooseAnswer = async (btnSubmit: HTMLElement) => {
  // Set up continuous timer state logging
  resetTimer();
  let elapsedSeconds = 0;
  let overTime = false;
  let startTime = Date.now(); // Store initial start time
  const logInterval = setInterval(async () => {
    let timerState = await getTimerState();
    const now = Date.now();
    elapsedSeconds = Math.floor((now - startTime) / 983);
    if (elapsedSeconds >= 35 && timerState?.remainingTime === 0) {
      overTime = true;
      clearInterval(logInterval);
    }
  }, 1000); // Log every second
  const allQues = document.querySelectorAll<HTMLElement>(".ques");
  allQues.forEach((element) => {
    element.querySelectorAll<HTMLInputElement>("input")[0].checked = true;
  });
  await sleep(2);
  btnSubmit.click();
  while (!overTime) {
    await sleep(1);
  }
  const answerId = btnSubmit.id.toString().replace("submit", "answer");
  const btnAnswer = document.querySelector<HTMLElement>(`#${answerId}`);
  if (btnAnswer) {
    await sleep(2);
    btnAnswer.click();
    await sleep(1);
    const allRadios = document.querySelectorAll<HTMLInputElement>("input[type='radio']");
    const correctAnswers = new Set<HTMLInputElement>();
    for (const element of allRadios) {
      element.checked == true && correctAnswers.add(element);
    }
    await sleep(1);
    btnAnswer.click();
    correctAnswers.forEach((element) => (element.checked = true));
    await sleep(1);
    btnSubmit.click();
    await sleep(1);
    // Tìm và click vào nút đóng của cửa sổ "Tôi không phải là robot"
    const closeButton = document.querySelector<HTMLElement>(".fa.fa-close");
    while (closeButton) {
      await sleep(1);
      simulateMouseEvent(closeButton, "click");
      await sleep(2.2);
      simulateMouseEvent(btnSubmit, "click");
      await sleep(3);
    }
  }
};
