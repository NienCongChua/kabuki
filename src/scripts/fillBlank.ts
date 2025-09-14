import { LoremIpsum } from "lorem-ipsum";
import { createWorker } from "tesseract.js";
import { preprocessImage } from "../helpers/imageHelper";
import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";

interface IAnswer {
  input: HTMLInputElement;
  ans: string;
}

// Guard để tránh fillBlank chạy đồng thời
let fillBlankRunning = false;

export const fillBlank = async (btnSubmit: HTMLElement) => {
  // Kiểm tra nếu đang chạy
  if (fillBlankRunning) {
    console.log("⚠️ [fillBlank] SKIP - fillBlank đang chạy, bỏ qua lần gọi này");
    return;
  }

  // Đánh dấu đang chạy
  fillBlankRunning = true;
  console.log("🔵 [fillBlank] Bắt đầu thực hiện fillBlank task");
  console.log("🔵 [fillBlank] Button submit:", btnSubmit);

  try {

  await sleep(0.5);
  const lorem = new LoremIpsum({
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  const allQues = document.querySelectorAll<HTMLInputElement>(".danw");
  console.log("🔵 [fillBlank] Tìm thấy", allQues.length, "câu hỏi fill blank");

  allQues.forEach((element, index) => {
    const sentence = lorem.generateSentences(1);
    element.value = sentence;
    console.log(`🔵 [fillBlank] Điền câu ${index + 1}:`, sentence);
  });

  await sleep(1);
  console.log("🔵 [fillBlank] Click submit button lần đầu");
  simulateMouseEvent(btnSubmit, "click");
  await sleep(2);
  const answerId = btnSubmit.id.toString().replace("submit", "answer");
  console.log("🔵 [fillBlank] Tìm kiếm button answer với ID:", answerId);

  const btnAnswer = document.querySelector<HTMLElement>(`#${answerId}`);
  if (btnAnswer) {
    console.log("🔵 [fillBlank] Tìm thấy button answer, chờ 30 giây để xem đáp án");
    await sleep(30);
    console.log("🔵 [fillBlank] Click button answer để xem đáp án");
    simulateMouseEvent(btnAnswer, "click");
    await sleep(2);
    const correctAnswers: IAnswer[] = [];
    console.log("🔵 [fillBlank] Bắt đầu OCR để đọc đáp án từ", allQues.length, "hình ảnh");

    for (const input of allQues) {
      const base64Img = input.style.backgroundImage.slice(4, -1).replace(/"/g, "");
      console.log("🔵 [fillBlank] Xử lý hình ảnh OCR cho input:", input);

      const imgData = await preprocessImage(base64Img);
      const worker = await createWorker("eng");
      let {
        data: { text },
      } = await worker.recognize(imgData);
      await worker.terminate();

      // Xử lý text nhận diện được
      const originalText = text;
      text = text == "Cc\n" ? "c" : text;
      text = text == "" ? "i" : text;
      const finalText = text.replace(/\|/g, "I");

      console.log("🔵 [fillBlank] OCR result:", {
        original: originalText,
        processed: finalText
      });

      correctAnswers.push({ input: input, ans: finalText });
    }
    console.log("🔵 [fillBlank] Tất cả đáp án đã được OCR:", correctAnswers);
    await sleep(2);
    console.log("🔵 [fillBlank] Click button answer lần 2 để đóng popup đáp án");
    simulateMouseEvent(btnAnswer, "click");
    await sleep(2);

    console.log("🔵 [fillBlank] Điền đáp án chính xác vào các input");
    correctAnswers.forEach(({ input, ans }, index) => {
      input.value = ans;
      console.log(`🔵 [fillBlank] Điền đáp án ${index + 1}: "${ans}"`);
    });

    await sleep(2);
    console.log("🔵 [fillBlank] Click submit button lần cuối để nộp bài");
    simulateMouseEvent(btnSubmit, "click");
    await sleep(1);

    // Kiểm tra popup verify human
    const closeButton = document.querySelector<HTMLElement>(".fa.fa-close");
    if (closeButton) {
      console.log("🔵 [fillBlank] Phát hiện popup verify human");
      simulateMouseEvent(closeButton, "click");
      console.log("🔵 [fillBlank] Đã đóng popup verify human");
      simulateMouseEvent(btnSubmit, "click");
      console.log("🔵 [fillBlank] Click submit lại sau khi đóng popup");
    }

    console.log("🔵 [fillBlank] Hoàn thành fillBlank task");
  } else {
    console.log("❌ [fillBlank] Không tìm thấy button answer với ID:", answerId);
  }

  } catch (error) {
    console.log("❌ [fillBlank] Lỗi trong quá trình thực hiện:", error);
  } finally {
    // Reset flag khi hoàn thành hoặc có lỗi
    fillBlankRunning = false;
    console.log("🔵 [fillBlank] Reset fillBlankRunning flag");
  }
};
