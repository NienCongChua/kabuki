import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";
import { resetTimer } from "../utils/timerManager";

export const writeWord = async () => {
  resetTimer();
  let active: HTMLElement | null = document.querySelector<HTMLElement>(".dvoca.active");
  let questionsArray = document.querySelectorAll(".dvoca");
  let answeredNumber = 0;

  // Kiểm tra xem có từ vựng trong localStorage không
  const vocabFromStorage = localStorage.getItem("vocab");
  if (!vocabFromStorage) {
    alert("Không có từ vựng nào trong từ điển");
    return;
  }

  let vocabArr: string[] = JSON.parse(vocabFromStorage);
  while (questionsArray.length > answeredNumber) {
    let charArr = [];
    let charDiv = active!.querySelectorAll<HTMLElement>(".dstore li div");
    let trueVocab: string[] = [];
    for (const x of charDiv) {
      charArr.push(x.textContent);
    }
    let found: boolean[] = [];
    for (const vocab of vocabArr) {
      if (vocab.length == charArr.length && vocab.toUpperCase().split("").sort().join() == charArr.sort().join()) {
        trueVocab = vocab.toUpperCase().split("");
        found.push(true);
      } else {
        found.push(false);
      }
    }
    
    // if (!found) {
    //   alert("Từ vựng không có trong từ điển, vui lòng tự click từ");
    //   // Chờ người dùng click xong từ
    //   while (active === document.querySelector<HTMLElement>(".dvoca.active")) {
    //     await sleep(1);
    //   }
    //   answeredNumber++;
    //   active = document.querySelector<HTMLElement>(".dvoca.active");
    //   continue;
    // }

    while (charDiv.length > 0) {
      l1: for (const x of trueVocab) {
        l2: for (const y of charDiv) {
          if (x == y.textContent) {
            await sleep(0.5);
            simulateMouseEvent(y, "click");
            charDiv = active!.querySelectorAll<HTMLElement>(".dstore li div");
            continue l1;
          }
        }
      }
    }
    
    await sleep(2);
    if (active != document.querySelector<HTMLElement>(".dvoca.active")) {
      answeredNumber++;
      active = document.querySelector<HTMLElement>(".dvoca.active");
    }
    await sleep(1);
  // Tìm và click vào nút đóng của cửa sổ "Tôi không phải là robot"
  const closeButton = document.querySelector<HTMLElement>(".fa.fa-close");
  while (closeButton) {
    simulateMouseEvent(closeButton, "click");
    await sleep(2.2)
  }
  }
};

