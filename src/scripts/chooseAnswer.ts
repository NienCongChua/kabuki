import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";

export const chooseAnswer = async (btnSubmit: HTMLElement) => {
  const allQues = document.querySelectorAll<HTMLElement>(".ques");
  allQues.forEach((element) => {
    element.querySelectorAll<HTMLInputElement>("input")[0].checked = true;
  });
  await sleep(3);
  btnSubmit.click();
  const answerId = btnSubmit.id.toString().replace("submit", "answer");
  const btnAnswer = document.querySelector<HTMLElement>(`#${answerId}`);
  if (btnAnswer) {
    await sleep(35);
    btnAnswer.click();
    await sleep(2);
    const allRadios = document.querySelectorAll<HTMLInputElement>("input[type='radio']");
    const correctAnswers = new Set<HTMLInputElement>();
    for (const element of allRadios) {
      element.checked == true && correctAnswers.add(element);
    }
    await sleep(2);
    btnAnswer.click();
    correctAnswers.forEach((element) => (element.checked = true));
    await sleep(2);
    btnSubmit.click();
    await sleep(1);
    // Tìm và click vào nút đóng của cửa sổ "Tôi không phải là robot"
    const closeButton = document.querySelector<HTMLElement>(".fa.fa-close");
    if (closeButton) {
      console.log("Found verify human");
      simulateMouseEvent(closeButton, "click");
      console.log("Closed verify human");
      simulateMouseEvent(btnSubmit, "click");
    }
  }
};
