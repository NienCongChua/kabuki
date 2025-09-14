import { LoremIpsum } from "lorem-ipsum";
import { createWorker } from "tesseract.js";
import { preprocessImage } from "../helpers/imageHelper";
import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";

interface IAnswer {
  input: HTMLInputElement;
  ans: string;
}
export const fillBlank = async (btnSubmit: HTMLElement) => {
  await sleep(0.5);
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
  await sleep(1);
  simulateMouseEvent(btnSubmit, "click");
  const answerId = btnSubmit.id.toString().replace("submit", "answer");
  const btnAnswer = document.querySelector<HTMLElement>(`#${answerId}`);
  if (btnAnswer) {
    await sleep(30);
    simulateMouseEvent(btnAnswer, "click");
    await sleep(2);
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
    console.log(correctAnswers);
    await sleep(2);
    simulateMouseEvent(btnAnswer, "click");
    await sleep(2);
    correctAnswers.forEach(({ input, ans }) => (input.value = ans));
    await sleep(2);
    simulateMouseEvent(btnSubmit, "click");
    await sleep(1);
    const closeButton = document.querySelector<HTMLElement>(".fa.fa-close");
    if (closeButton) {
      console.log("Found verify human");
      simulateMouseEvent(closeButton, "click");
      console.log("Closed verify human");
      simulateMouseEvent(btnSubmit, "click");
    }
  }
};
