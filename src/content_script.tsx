import { createWorker } from "tesseract.js";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const inputArr = document.querySelectorAll<HTMLElement>(".danw");
  inputArr.forEach(async (inputElement) => {
    const base64Img = inputElement.style.backgroundImage
      .slice(4, -1)
      .replace(/"/g, "");
    const worker = await createWorker("eng");
    const ret = await worker.recognize(base64Img);
    console.log(ret.data.text);
  });
});
