import { getRandomNumber } from "../utils/getRandomNumber";
import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";

// Guard để tránh vocabulary chạy đồng thời
let vocabularyRunning = false;

export const vocabulary = async (btnSubmit: HTMLElement) => {
  // Kiểm tra nếu đang chạy
  if (vocabularyRunning) {
    console.log("⚠️ [vocabulary] SKIP - vocabulary đang chạy, bỏ qua lần gọi này");
    return;
  }

  // Đánh dấu đang chạy
  vocabularyRunning = true;
  console.log("🟡 [vocabulary] Bắt đầu thực hiện vocabulary task");
  console.log("🟡 [vocabulary] Button submit:", btnSubmit);

  try {

  const vocabElementArr = document.querySelectorAll<HTMLElement>("h4");
  console.log("🟡 [vocabulary] Tìm thấy", vocabElementArr.length, "từ vựng");

  let vocabArr: string[] = [];
  if (localStorage.getItem("vocab") != null) {
    vocabArr = JSON.parse(localStorage.getItem("vocab")!);
    console.log("🟡 [vocabulary] Khôi phục", vocabArr.length, "từ vựng từ localStorage");
  } else {
    console.log("🟡 [vocabulary] Bắt đầu với danh sách từ vựng trống");
  }

  vocabElementArr.forEach((v, index) => {
    const audioElement = v.querySelector<HTMLElement>(".daudio");
    if (audioElement) {
      audioElement.click();
      console.log(`🟡 [vocabulary] Click audio cho từ vựng ${index + 1}`);
    }

    let trimVocab = v.textContent!.trim();
    trimVocab = trimVocab.replace(/\s*\([^)]*\)$/, "");
    console.log(`🟡 [vocabulary] Xử lý từ vựng ${index + 1}: "${trimVocab}"`);

    if (vocabArr.indexOf(trimVocab) == -1) {
      vocabArr.push(trimVocab);
      console.log(`🟡 [vocabulary] Thêm từ vựng mới: "${trimVocab}"`);
    } else {
      console.log(`🟡 [vocabulary] Từ vựng đã tồn tại: "${trimVocab}"`);
    }
  });

  console.log("🟡 [vocabulary] Danh sách từ vựng cuối cùng:", vocabArr);
  console.log("🟡 [vocabulary] Tổng cộng", vocabArr.length, "từ vựng");
  localStorage.setItem("vocab", JSON.stringify(vocabArr));
  console.log("🟡 [vocabulary] Đã lưu từ vựng vào localStorage");
  // sessionStorage.removeItem("vocab");
  // document.querySelectorAll<HTMLElement>(".daudio").forEach((element) => {
  //   element.setAttribute("muted", "muted");
  //   element.click();
  // });

  const randomDelay = getRandomNumber(3, 5);
  console.log("🟡 [vocabulary] Chờ", randomDelay, "giây trước khi submit");
  await sleep(randomDelay);

  console.log("🟡 [vocabulary] Click submit button để hoàn thành");
  simulateMouseEvent(btnSubmit, "click");
  console.log("🟡 [vocabulary] Hoàn thành vocabulary task");
  // setTimeout(() => btnSubmit.click(), getRandomNumber(3, 5) * 1000);

  } catch (error) {
    console.log("❌ [vocabulary] Lỗi trong quá trình thực hiện:", error);
  } finally {
    // Reset flag khi hoàn thành hoặc có lỗi
    vocabularyRunning = false;
    console.log("🟡 [vocabulary] Reset vocabularyRunning flag");
  }
};
