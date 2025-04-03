import { LoremIpsum } from "lorem-ipsum";
import { createWorker } from "tesseract.js";
import { preprocessImage } from "../helpers/imageHelper";
import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";
import { getTimerState, resetTimer } from "../utils/timerManager";

interface IAnswer {
  input: HTMLInputElement;
  ans: string;
}
export const fillBlank = async (btnSubmit: HTMLElement) => {
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
  const lorem = new LoremIpsum({
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });
  const allQues = document.querySelectorAll<HTMLInputElement>(".danw");
  allQues.forEach((element) => {
    element.value = lorem.generateSentences(1);
  });
  await sleep(2);
  simulateMouseEvent(btnSubmit, "click");
  while (!overTime) {
    await sleep(1);
  }
  const answerId = btnSubmit.id.toString().replace("submit", "answer");
  const btnAnswer = document.querySelector<HTMLElement>(`#${answerId}`);
  if (btnAnswer) {
    await sleep(2);
    simulateMouseEvent(btnAnswer, "click");
    await sleep(3);
    const correctAnswers: IAnswer[] = [];
    for (const input of allQues) {
      const base64Img = input.style.backgroundImage.slice(4, -1).replace(/"/g, "");
      const imgData = await preprocessImage(base64Img);
      const worker = await createWorker("eng");
      let {
        data: { text },
      } = await worker.recognize(imgData);
      await worker.terminate();
      text = text == "Cc\n" ? "c" : text;
      text = text == "" ? "i" : text;
      correctAnswers.push({ input: input, ans: text.replace(/\|/g, "I") });
    }
    await sleep(2);
    simulateMouseEvent(btnAnswer, "click");
    await sleep(1);
    correctAnswers.forEach(({ input, ans }) => (input.value = ans));
    await sleep(1);
    simulateMouseEvent(btnSubmit, "click");
    await sleep(2);
    // Tìm và click vào nút đóng của cửa sổ "Tôi không phải là robot"
    const closeButton = document.querySelector<HTMLElement>(".fa.fa-close");
    while (closeButton) {
      await sleep(1);
      simulateMouseEvent(closeButton, "click");
      await sleep(2.2);
      simulateMouseEvent(btnSubmit, "click");
    }
  }
};
