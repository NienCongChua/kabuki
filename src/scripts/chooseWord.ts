import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";

// Guard để tránh chooseWord chạy đồng thời
let chooseWordRunning = false;

export const chooseWord = async () => {
  // Kiểm tra nếu đang chạy
  if (chooseWordRunning) {
    console.log("⚠️ [chooseWord] SKIP - chooseWord đang chạy, bỏ qua lần gọi này");
    return;
  }

  // Đánh dấu đang chạy
  chooseWordRunning = true;
  console.log("🟢 [chooseWord] Bắt đầu thực hiện chooseWord task");

  try {

  let active: HTMLElement | null = document.querySelector<HTMLElement>(".dvoca.active");
  let questionsArray = document.querySelectorAll(".dvoca");
  let answeredNumber = 0;

  console.log("🟢 [chooseWord] Tìm thấy", questionsArray.length, "câu hỏi chooseWord");
  console.log("🟢 [chooseWord] Câu hỏi hiện tại:", active);

  while (questionsArray.length > answeredNumber) {
    console.log(`🟢 [chooseWord] Xử lý câu hỏi ${answeredNumber + 1}/${questionsArray.length}`);

    let answers = active?.querySelectorAll<HTMLElement>(".dtitle");
    console.log("🟢 [chooseWord] Tìm thấy", answers?.length, "lựa chọn đáp án");
    console.log("🟢 [chooseWord] Các đáp án:", answers);

    for (const [index, x] of answers!.entries()) {
      console.log(`🟢 [chooseWord] Thử đáp án ${index + 1}: "${x.textContent}"`);
      simulateMouseEvent(x, "click");

      console.log("🟢 [chooseWord] Chờ 3 giây để kiểm tra kết quả");
      await sleep(3);

      const newActive = document.querySelector<HTMLElement>(".dvoca.active");
      if (active != newActive) {
        answeredNumber++;
        active = newActive;
        console.log(`✅ [chooseWord] Đáp án đúng! Hoàn thành câu ${answeredNumber}, chuyển sang câu tiếp theo`);
        break;
      } else {
        console.log(`❌ [chooseWord] Đáp án sai: "${x.textContent}", thử đáp án tiếp theo`);
      }
    }

    // Kiểm tra nếu không có đáp án nào đúng
    if (active === document.querySelector<HTMLElement>(".dvoca.active")) {
      console.log("⚠️ [chooseWord] Không có đáp án nào đúng cho câu này");
    }
  }

  console.log("🟢 [chooseWord] Hoàn thành tất cả", answeredNumber, "câu hỏi chooseWord");

  } catch (error) {
    console.log("❌ [chooseWord] Lỗi trong quá trình thực hiện:", error);
  } finally {
    // Reset flag khi hoàn thành hoặc có lỗi
    chooseWordRunning = false;
    console.log("🟢 [chooseWord] Reset chooseWordRunning flag");
  }
};
