import { randomNumber } from "../utils/randomNumber";

export const vocabulary = (btnSubmit: HTMLElement) => {
  let vocabPage = document.querySelector(".dvocabulary");
  if (vocabPage) {
    document.querySelectorAll<HTMLElement>(".daudio").forEach((element) => {
      element.setAttribute("muted", "muted");
      element.click();
    });
    setTimeout(() => btnSubmit.click(), randomNumber(3, 5) * 1000);
  }
};
