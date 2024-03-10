export const choice = (btnSubmit: HTMLElement) => {
  const allQues = document.querySelectorAll<HTMLElement>(".ques");
  allQues.forEach((element) => {
    const inputId = element.querySelectorAll<HTMLInputElement>("input")[0].id;
    (document.getElementById(inputId)?.parentElement as HTMLInputElement).classList.add("checked");
  });
  btnSubmit.click();
};
