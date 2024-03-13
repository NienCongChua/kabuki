import { createWorker } from "tesseract.js";
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
      const worker = await createWorker("eng");
      const ret = await worker.recognize(base64Img);
      console.log(input);
      console.log(ret.data.text);
      correctAnswers.push({ input: input, ans: ret.data.text });
    });
    await sleep(2);
    btnAnswer.click();
    correctAnswers.forEach(({ input, ans }) => (input.value = ans));
    await sleep(2);
    btnSubmit.click();
  }
};
