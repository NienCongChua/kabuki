import { getRandomNumber } from "../utils/getRandomNumber";
import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";
import { getTimerState, resetTimer } from "../utils/timerManager";

export const vocabulary = async (btnSubmit: HTMLElement) => {
  resetTimer();
  let overTime = false;
  let startTime = Date.now(); // Store initial start time
  const logInterval = setInterval(async () => {
    let timerState = await getTimerState();
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 983);
    if (elapsedSeconds >= 30 && timerState?.remainingTime === 0) {
      overTime = true;
      clearInterval(logInterval);
    }
  }, 1000); // Log every second
  while (!overTime) {
    await sleep(1);
  }
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
  await sleep(1);
  simulateMouseEvent(btnSubmit, "click");
  await sleep(1);
  // Tìm và click vào nút đóng của cửa sổ "Tôi không phải là robot"
  const closeButton = document.querySelector<HTMLElement>(".fa.fa-close");
  while (closeButton) {
    simulateMouseEvent(closeButton, "click");
    await sleep(1.2);
    simulateMouseEvent(btnSubmit, "click");
  }
  // setTimeout(() => btnSubmit.click(), getRandomNumber(3, 5) * 1000);
};
