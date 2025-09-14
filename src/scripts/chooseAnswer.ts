import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";

// Guard để tránh chooseAnswer chạy đồng thời
let chooseAnswerRunning = false;

export const chooseAnswer = async (btnSubmit: HTMLElement) => {
  // Kiểm tra nếu đang chạy
  if (chooseAnswerRunning) {
    console.log("⚠️ [chooseAnswer] SKIP - chooseAnswer đang chạy, bỏ qua lần gọi này");
    return;
  }

  // Đánh dấu đang chạy
  chooseAnswerRunning = true;
  console.log("🟠 [chooseAnswer] Bắt đầu thực hiện chooseAnswer task");
  console.log("🟠 [chooseAnswer] Button submit:", btnSubmit);

  try {

  await sleep(0.5);
  const allQues = document.querySelectorAll<HTMLElement>(".ques");
  console.log("🟠 [chooseAnswer] Tìm thấy", allQues.length, "câu hỏi");

  allQues.forEach((element, index) => {
    const firstInput = element.querySelectorAll<HTMLInputElement>("input")[0];
    firstInput.checked = true;
    console.log(`🟠 [chooseAnswer] Chọn đáp án đầu tiên cho câu ${index + 1}`);
  });

  await sleep(1);
  console.log("🟠 [chooseAnswer] Click submit button lần đầu");
  btnSubmit.click();
  const answerId = btnSubmit.id.toString().replace("submit", "answer");
  console.log("🟠 [chooseAnswer] Tìm kiếm button answer với ID:", answerId);

  const btnAnswer = document.querySelector<HTMLElement>(`#${answerId}`);
  if (btnAnswer) {
    console.log("🟠 [chooseAnswer] Tìm thấy button answer, chờ 30 giây để xem đáp án");
    await sleep(30);
    console.log("🟠 [chooseAnswer] Click button answer để xem đáp án");
    btnAnswer.click();
    await sleep(2);

    const allRadios = document.querySelectorAll<HTMLInputElement>("input[type='radio']");
    console.log("🟠 [chooseAnswer] Tìm thấy", allRadios.length, "radio buttons");

    const correctAnswers = new Set<HTMLInputElement>();
    for (const element of allRadios) {
      if (element.checked == true) {
        correctAnswers.add(element);
        console.log("🟠 [chooseAnswer] Phát hiện đáp án đúng:", element.value || element.name);
      }
    }
    console.log("🟠 [chooseAnswer] Tổng cộng", correctAnswers.size, "đáp án đúng");

    await sleep(2);
    console.log("🟠 [chooseAnswer] Click button answer lần 2 để đóng popup đáp án");
    btnAnswer.click();

    console.log("🟠 [chooseAnswer] Chọn các đáp án đúng");
    let answerIndex = 1;
    correctAnswers.forEach((element) => {
      element.checked = true;
      console.log(`🟠 [chooseAnswer] Chọn đáp án đúng ${answerIndex}:`, element.value || element.name);
      answerIndex++;
    });

    await sleep(2);
    console.log("🟠 [chooseAnswer] Click submit button lần cuối để nộp bài");
    btnSubmit.click();
    await sleep(1);

    // Kiểm tra popup verify human
    const closeButton = document.querySelector<HTMLElement>(".fa.fa-close");
    if (closeButton) {
      console.log("🟠 [chooseAnswer] Phát hiện popup verify human");
      simulateMouseEvent(closeButton, "click");
      console.log("🟠 [chooseAnswer] Đã đóng popup verify human");
      simulateMouseEvent(btnSubmit, "click");
      console.log("🟠 [chooseAnswer] Click submit lại sau khi đóng popup");
    }

    console.log("🟠 [chooseAnswer] Hoàn thành chooseAnswer task");
  } else {
    console.log("❌ [chooseAnswer] Không tìm thấy button answer với ID:", answerId);
  }

  } catch (error) {
    console.log("❌ [chooseAnswer] Lỗi trong quá trình thực hiện:", error);
  } finally {
    // Reset flag khi hoàn thành hoặc có lỗi
    chooseAnswerRunning = false;
    console.log("🟠 [chooseAnswer] Reset chooseAnswerRunning flag");
  }
};
