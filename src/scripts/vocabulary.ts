import { getRandomNumber } from "../utils/getRandomNumber";

export const vocabulary = (btnSubmit: HTMLElement) => {
  let vocabPage = document.querySelector(".dvocabulary");
  if (vocabPage) {
    document.querySelectorAll<HTMLElement>(".daudio").forEach((element) => {
      element.setAttribute("muted", "muted");
      element.click();
    });
    setTimeout(() => btnSubmit.click(), getRandomNumber(3, 5) * 1000);
  }
};
