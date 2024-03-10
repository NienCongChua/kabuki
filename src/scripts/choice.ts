import { wait } from "../utils/wait";

export const choice = async (btnSubmit: HTMLElement) => {
  const allQues = document.querySelectorAll<HTMLElement>(".ques");
  allQues.forEach((element) => {
    element.querySelectorAll<HTMLInputElement>("input")[0].checked = true;
    // (document.getElementById(inputId)?.parentElement as HTMLInputElement).classList.add("checked");
  });
  await wait(3);
  btnSubmit.click();
  const answerId = btnSubmit.id.toString().replace("submit", "answer");
  const btnAnswer = document.querySelector<HTMLElement>(`#${answerId}`);
  if (btnAnswer) {
    await wait(35);
    btnAnswer.click();
    await wait(2);
    const allRadios = document.querySelectorAll<HTMLInputElement>("input[type='radio']");
    const correctAnswers = new Set<HTMLInputElement>();
    allRadios.forEach((element) => {
      element.checked == true && correctAnswers.add(element);
    });
    await wait(2);
    btnAnswer.click();
    correctAnswers.forEach((element) => (element.checked = true));
    wait(2);
    btnSubmit.click();
  }
};
