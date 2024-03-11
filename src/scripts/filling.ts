import { createWorker } from "tesseract.js";

export const filling = async (btnSubmit: HTMLElement) => {
  const inputArr = document.querySelectorAll<HTMLElement>(".danw");
  const correctAnswers = new Set<string>();
  inputArr.forEach(async (inputElement) => {
    const base64Img = inputElement.style.backgroundImage.slice(4, -1).replace(/"/g, "");
    const worker = await createWorker("eng");
    const ret = await worker.recognize(base64Img);
    correctAnswers.add(ret.data.text);
  });
  console.log(correctAnswers);
};
