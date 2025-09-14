import { simulateMouseEvent } from "../utils/simulateMouseEvent";
import { sleep } from "../utils/sleep";

// Guard để tránh writeWord chạy đồng thời
let writeWordRunning = false;

export const writeWord = async () => {
  // Kiểm tra nếu đang chạy
  if (writeWordRunning) {
    console.log("⚠️ [writeWord] SKIP - writeWord đang chạy, bỏ qua lần gọi này");
    return;
  }

  // Đánh dấu đang chạy
  writeWordRunning = true;
  console.log("🟣 [writeWord] Bắt đầu thực hiện writeWord task");

  try {

  let active: HTMLElement | null = document.querySelector<HTMLElement>(".dvoca.active");
  let questionsArray = document.querySelectorAll(".dvoca");
  let answeredNumber = 0;

  console.log("🟣 [writeWord] Tìm thấy", questionsArray.length, "câu hỏi writeWord");
  console.log("🟣 [writeWord] Câu hỏi hiện tại:", active);

  // Kiểm tra xem có từ vựng trong localStorage không
  const vocabFromStorage = localStorage.getItem("vocab");
  if (!vocabFromStorage) {
    console.log("❌ [writeWord] Không có từ vựng trong localStorage");
    alert("Không có từ vựng nào trong từ điển");
    return;
  }

  let vocabArr: string[] = JSON.parse(vocabFromStorage);
  console.log("🟣 [writeWord] Tải được", vocabArr.length, "từ vựng từ localStorage");
  console.log("🟣 [writeWord] Danh sách từ vựng:", vocabArr);
  while (questionsArray.length > answeredNumber) {
    console.log(`🟣 [writeWord] Xử lý câu hỏi ${answeredNumber + 1}/${questionsArray.length}`);

    let charArr = [];
    let charDiv = active!.querySelectorAll<HTMLElement>(".dstore li div");
    let trueVocab: string[] = [];

    console.log("🟣 [writeWord] Tìm thấy", charDiv.length, "ký tự để ghép từ");

    for (const x of charDiv) {
      charArr.push(x.textContent);
    }
    console.log("🟣 [writeWord] Các ký tự có sẵn:", charArr);

    let found: boolean[] = [];
    let matchedVocab = "";

    for (const vocab of vocabArr) {
      if (vocab.length == charArr.length && vocab.toUpperCase().split("").sort().join() == charArr.sort().join()) {
        trueVocab = vocab.toUpperCase().split("");
        found.push(true);
        matchedVocab = vocab;
        console.log("🟣 [writeWord] Tìm thấy từ vựng khớp:", vocab);
        break; // Tìm thấy rồi thì dừng
      } else {
        found.push(false);
      }
    }

    if (!found.includes(true)) {
      console.log("❌ [writeWord] Không tìm thấy từ vựng khớp với các ký tự:", charArr);
    } else {
      console.log("✅ [writeWord] Sẽ ghép từ:", matchedVocab, "→", trueVocab);
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

    console.log("🟣 [writeWord] Bắt đầu click các ký tự theo thứ tự:", trueVocab);
    let clickedChars = [];

    while (charDiv.length > 0) {
      l1: for (const x of trueVocab) {
        l2: for (const y of charDiv) {
          if (x == y.textContent) {
            await sleep(0.5);
            console.log(`🟣 [writeWord] Click ký tự: "${x}"`);
            simulateMouseEvent(y, "click");
            clickedChars.push(x);
            charDiv = active!.querySelectorAll<HTMLElement>(".dstore li div");
            continue l1;
          }
        }
      }
    }

    console.log("🟣 [writeWord] Đã click các ký tự:", clickedChars.join(""));
    console.log("🟣 [writeWord] Chờ 2 giây để kiểm tra kết quả");

    await sleep(2);
    const newActive = document.querySelector<HTMLElement>(".dvoca.active");
    if (active != newActive) {
      answeredNumber++;
      active = newActive;
      console.log(`✅ [writeWord] Hoàn thành câu ${answeredNumber}, chuyển sang câu tiếp theo`);
    } else {
      console.log("⚠️ [writeWord] Câu hỏi chưa được hoàn thành, có thể cần thử lại");
    }
  }

  console.log("🟣 [writeWord] Hoàn thành tất cả", answeredNumber, "câu hỏi writeWord");

  } catch (error) {
    console.log("❌ [writeWord] Lỗi trong quá trình thực hiện:", error);
  } finally {
    // Reset flag khi hoàn thành hoặc có lỗi
    writeWordRunning = false;
    console.log("🟣 [writeWord] Reset writeWordRunning flag");
  }
};

