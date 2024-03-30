import { createWorker } from "tesseract.js";
import { preprocessImage } from "../helpers/imageHelper";
import { sleep } from "../utils/sleep";

interface IAnswer {
  input: HTMLInputElement;
  ans: string;
}
export const filling = async (btnSubmit: HTMLElement) => {
  const allQues = document.querySelectorAll<HTMLInputElement>(".danw");
  allQues.forEach((element) => {
    element.value = "1324132";
  });
  await sleep(3);
  btnSubmit.click();
  const answerId = btnSubmit.id.toString().replace("submit", "answer");
  const btnAnswer = document.querySelector<HTMLElement>(`#${answerId}`);
  if (btnAnswer) {
    await sleep(35);
    btnAnswer.click();
    await sleep(2);
    const correctAnswers: IAnswer[] = [];
    await allQues.forEach(async (input) => {
      const base64Img = input.style.backgroundImage.slice(4, -1).replace(/"/g, "");
      const imgData = await preprocessImage(base64Img);
      console.log(imgData);
      const worker = await createWorker("eng");
      const {
        data: { text },
      } = await worker.recognize(imgData);
      console.log(text);
      correctAnswers.push({ input: input, ans: text.replace(/\|/g, "I") });
      console.log(correctAnswers);
    });
    await sleep(2);
    btnAnswer.click();
    await sleep(2);
    correctAnswers.forEach(({ input, ans }) => (input.value = ans));
    await sleep(2);
    btnSubmit.click();
  }
};
