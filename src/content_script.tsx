import { chooseAnswer } from "./scripts/chooseAnswer";
import { chooseWord } from "./scripts/chooseWord";
import { fillBlank } from "./scripts/fillBlank";
import { vocabulary } from "./scripts/vocabulary";
import { writeWord } from "./scripts/writeWord";
import { sleep } from "./utils/sleep";

// Tính toán thời gian còn lại chính xác từ timer state
function calculateActualRemainingTime(): number {
  if (!currentTimerState.isRunning || !currentTimerState.autoMode) {
    return 0;
  }

  // Tính thời gian đã trôi qua từ khi start
  const elapsed = Math.floor((Date.now() - currentTimerState.startTime) / 1000);
  const remaining = Math.max(0, currentTimerState.delay - elapsed);

  return remaining;
}

// Sleep với kiểm tra state mỗi 100ms
function sleepWithStateCheck(seconds: number): Promise<boolean> {
  return new Promise((resolve) => {
    let elapsed = 0;
    const interval = 100; // Check every 100ms

    const checkInterval = setInterval(() => {
      // Kiểm tra nếu bị dừng
      if (!currentTimerState.autoMode || !currentTimerState.isRunning) {
        clearInterval(checkInterval);
        resolve(false); // Bị dừng
        return;
      }

      elapsed += interval;
      if (elapsed >= seconds * 1000) {
        clearInterval(checkInterval);
        resolve(true); // Hoàn thành
      }
    }, interval);
  });
}

// Biến lưu trạng thái timer
let currentTimerState = {
  isRunning: false,
  delay: 30,
  startTime: 0,
  autoMode: false,
  remainingTime: 30,
  currentTaskId: null as string | null,
  pausedTime: 0
};

const getTaskClassList = () => {
  return document.querySelector<HTMLElement>("#mbody")?.firstElementChild?.classList;
};

async function onMutation(dtk: string) {
  let btnSubmit = document.querySelector<HTMLElement>(`button[dtk2="${dtk}"]`);
  let count = 0;
  while (btnSubmit === null) {
    if (count == 10) window.location.reload();
    btnSubmit = document.querySelector<HTMLElement>(`button[dtk2="${dtk}"]`);
    await sleep(1);
    count++;
  }

  if (!btnSubmit.hasAttribute("disabled")) {
    // Kiểm tra auto mode và running state
    if (!currentTimerState.autoMode || !currentTimerState.isRunning) {
      return; // Chỉ chạy khi cả autoMode và isRunning đều true
    }

    // Tính toán thời gian chờ chính xác
    const actualRemainingTime = calculateActualRemainingTime();
    console.log("🕐 Timer State:", {
      delay: currentTimerState.delay,
      startTime: currentTimerState.startTime,
      currentTime: Date.now(),
      elapsed: Math.floor((Date.now() - currentTimerState.startTime) / 1000),
      actualRemainingTime: actualRemainingTime
    });

    if (actualRemainingTime > 0) {
      console.log("⏳ Extension sẽ chờ", actualRemainingTime, "giây nữa");
      const success = await sleepWithStateCheck(actualRemainingTime);
      if (!success) {
        console.log("❌ Bị dừng trong quá trình chờ");
        return; // Bị dừng trong quá trình đợi
      }
    } else {
      console.log("⚡ Thời gian đã hết, thực hiện ngay lập tức");
    }

    // Kiểm tra lại state trước khi thực hiện
    if (!currentTimerState.autoMode || !currentTimerState.isRunning) {
      return;
    }

    // Thực hiện bài tập
    executeTask(btnSubmit);
  }
}

// Tách logic thực hiện bài tập ra function riêng
function executeTask(btnSubmit: HTMLElement) {
  const classList = getTaskClassList();
  const taskType = classList!.item(1)!.toString();

  if (taskType == "default") vocabulary(btnSubmit);
  if (taskType == "audio-write-word" || taskType == "pronunciation-write-word") writeWord();
  if (
    taskType == "fill-reading-word-blank" ||
    taskType == "fill-listening-write-answer" ||
    taskType == "fill-vocabulary-block-blank" ||
    taskType == "fill-grammar-word-blank"
  )
    fillBlank(btnSubmit);
  if (taskType == "choose-listening-choose-answer" || taskType == "choose-reading-choose-answer")
    chooseAnswer(btnSubmit);
  if (taskType == "view-content") {
    sleep(3).then(() => btnSubmit.click());
  }
  if (taskType == "upload-content") console.log("Upload");
  if (
    taskType == "image-choose-word" ||
    taskType == "audio-choose-word" ||
    taskType == "word-choose-meaning" ||
    taskType == "audio-choose-image"
  )
    chooseWord();
}

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  const dtk = request.id;

  // Cập nhật timer state nếu có
  if (request.timerState) {
    currentTimerState = request.timerState;
  }

  onMutation(dtk);
  sendResponse({ success: true });
});
