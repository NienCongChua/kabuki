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
  console.log("⏳ [Content] sleepWithStateCheck bắt đầu chờ", seconds, "giây");

  return new Promise((resolve) => {
    let elapsed = 0;
    const interval = 100; // Check every 100ms
    let checkCount = 0;

    const checkInterval = setInterval(() => {
      checkCount++;

      // Log mỗi 10 lần check (1 giây)
      if (checkCount % 10 === 0) {
        console.log("⏳ [Content] Đã chờ", elapsed / 1000, "giây, còn", (seconds * 1000 - elapsed) / 1000, "giây");
        console.log("⏳ [Content] State hiện tại - autoMode:", currentTimerState.autoMode, "isRunning:", currentTimerState.isRunning);
      }

      // Kiểm tra nếu bị dừng
      if (!currentTimerState.autoMode || !currentTimerState.isRunning) {
        console.log("🛑 [Content] sleepWithStateCheck bị dừng - State thay đổi");
        console.log("🛑 [Content] autoMode:", currentTimerState.autoMode, "isRunning:", currentTimerState.isRunning);
        clearInterval(checkInterval);
        resolve(false); // Bị dừng
        return;
      }

      elapsed += interval;
      if (elapsed >= seconds * 1000) {
        console.log("✅ [Content] sleepWithStateCheck hoàn thành sau", elapsed / 1000, "giây");
        clearInterval(checkInterval);
        resolve(true); // Hoàn thành
      }
    }, interval);
  });
}

// Biến lưu trạng thái timer
let currentTimerState = {
  isRunning: false,
  delay: 60,
  startTime: 0,
  autoMode: false,
  remainingTime: 60,
  currentTaskId: null as string | null,
  pausedTime: 0
};

// Biến để lưu state backup
let lastKnownGoodState = { ...currentTimerState };

// Kiểm tra định kỳ state và khôi phục nếu cần
setInterval(() => {
  // Nếu autoMode bị tắt bất ngờ trong khi đang chạy
  if (lastKnownGoodState.autoMode && lastKnownGoodState.isRunning &&
      (!currentTimerState.autoMode || !currentTimerState.isRunning)) {

    console.log("🔄 [Content] Phát hiện state bị thay đổi bất ngờ trong interval check");
    console.log("🔄 [Content] Last good state:", lastKnownGoodState);
    console.log("🔄 [Content] Current state:", currentTimerState);

    // Thử sync lại state từ background
    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ action: "getState" }, (response) => {
        if (response?.success && response.state) {
          console.log("🔄 [Content] Sync state từ background:", response.state);
          currentTimerState = response.state;
        }
      });
    }
  }

  // Cập nhật backup state nếu autoMode đang bật
  if (currentTimerState.autoMode && currentTimerState.isRunning) {
    lastKnownGoodState = { ...currentTimerState };
  }
}, 5000); // Kiểm tra mỗi 5 giây

const getTaskClassList = () => {
  return document.querySelector<HTMLElement>("#mbody")?.firstElementChild?.classList;
};

async function onMutation(dtk: string) {
  console.log("🎯 [Content] onMutation bắt đầu với DTK:", dtk);
  console.log("🎯 [Content] Current timer state:", currentTimerState);

  let btnSubmit = document.querySelector<HTMLElement>(`button[dtk2="${dtk}"]`);
  let count = 0;
  while (btnSubmit === null) {
    if (count == 10) {
      console.log("❌ [Content] Không tìm thấy button submit sau 10 lần thử, reload trang");
      window.location.reload();
    }
    btnSubmit = document.querySelector<HTMLElement>(`button[dtk2="${dtk}"]`);
    await sleep(1);
    count++;
  }

  console.log("🎯 [Content] Tìm thấy button submit:", btnSubmit);
  console.log("🎯 [Content] Button disabled?", btnSubmit.hasAttribute("disabled"));

  if (!btnSubmit.hasAttribute("disabled")) {
    // Kiểm tra auto mode và running state
    console.log("🔍 [Content] Kiểm tra điều kiện auto mode:");
    console.log("🔍 [Content] autoMode:", currentTimerState.autoMode);
    console.log("🔍 [Content] isRunning:", currentTimerState.isRunning);

    if (!currentTimerState.autoMode || !currentTimerState.isRunning) {
      console.log("🛑 [Content] KHÔNG THỰC HIỆN - Auto mode tắt hoặc timer không chạy");
      console.log("🛑 [Content] autoMode:", currentTimerState.autoMode, "isRunning:", currentTimerState.isRunning);
      return; // Chỉ chạy khi cả autoMode và isRunning đều true
    }

    console.log("✅ [Content] Điều kiện đạt - Tiếp tục thực hiện task");

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
    console.log("🔍 [Content] Kiểm tra lại state trước khi thực hiện:");
    console.log("🔍 [Content] autoMode:", currentTimerState.autoMode, "isRunning:", currentTimerState.isRunning);

    if (!currentTimerState.autoMode || !currentTimerState.isRunning) {
      console.log("🛑 [Content] DỪNG - State đã thay đổi trong quá trình chờ");
      return;
    }

    // Thực hiện bài tập
    console.log("🚀 [Content] Bắt đầu thực hiện task");
    executeTask(btnSubmit);
  } else {
    console.log("⏸️ [Content] Button submit bị disabled, không thể thực hiện");
  }
}

// Tách logic thực hiện bài tập ra function riêng
function executeTask(btnSubmit: HTMLElement) {
  console.log("🚀 [Content] executeTask bắt đầu");

  const classList = getTaskClassList();
  const taskType = classList!.item(1)!.toString();

  console.log("🚀 [Content] Task type:", taskType);
  console.log("🚀 [Content] Class list:", classList);

  if (taskType == "default") {
    console.log("🚀 [Content] Thực hiện vocabulary task");
    vocabulary(btnSubmit);
  }
  if (taskType == "audio-write-word" || taskType == "pronunciation-write-word") {
    console.log("🚀 [Content] Thực hiện writeWord task");
    writeWord();
  }
  if (
    taskType == "fill-reading-word-blank" ||
    taskType == "fill-listening-write-answer" ||
    taskType == "fill-vocabulary-block-blank" ||
    taskType == "fill-grammar-word-blank"
  ) {
    console.log("🚀 [Content] Thực hiện fillBlank task");
    fillBlank(btnSubmit);
  }
  if (taskType == "choose-listening-choose-answer" || taskType == "choose-reading-choose-answer") {
    console.log("🚀 [Content] Thực hiện chooseAnswer task");
    chooseAnswer(btnSubmit);
  }
  if (taskType == "view-content") {
    console.log("🚀 [Content] Thực hiện view-content task");
    sleep(3).then(() => btnSubmit.click());
  }
  if (taskType == "upload-content") {
    console.log("🚀 [Content] Upload task - chưa implement");
  }
  if (
    taskType == "image-choose-word" ||
    taskType == "audio-choose-word" ||
    taskType == "word-choose-meaning" ||
    taskType == "audio-choose-image"
  ) {
    console.log("🚀 [Content] Thực hiện chooseWord task");
    chooseWord();
  }
}

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  console.log("📨 [Content] Nhận message từ background:", request);

  const dtk = request.id;

  // Cập nhật timer state nếu có
  if (request.timerState) {
    const oldState = { ...currentTimerState };
    currentTimerState = request.timerState;

    console.log("🔄 [Content] Cập nhật timer state:");
    console.log("🔄 [Content] State cũ:", oldState);
    console.log("🔄 [Content] State mới:", currentTimerState);

    // Kiểm tra nếu autoMode bị tắt bất ngờ
    if (oldState.autoMode && !currentTimerState.autoMode) {
      console.log("🛑 [Content] AUTO MODE BỊ TẮT! Từ true -> false");
      console.log("🛑 [Content] Có thể do tab navigation hoặc extension restart");

      // CẢNH BÁO: Đây có thể là lỗi không mong muốn
      if (oldState.isRunning && !request.action) {
        console.log("⚠️ [Content] CẢNH BÁO: AutoMode bị tắt trong khi đang chạy task!");
        console.log("⚠️ [Content] Đây có thể là lỗi do tab navigation");

        // TỰ ĐỘNG KHÔI PHỤC autoMode nếu bị tắt bất ngờ
        console.log("🔄 [Content] Thử khôi phục autoMode bằng cách gửi message start");
        setTimeout(() => {
          if (chrome.runtime?.sendMessage) {
            chrome.runtime.sendMessage({ action: "start" }, (response) => {
              if (response?.success) {
                console.log("✅ [Content] Đã khôi phục autoMode thành công");
              } else {
                console.log("❌ [Content] Không thể khôi phục autoMode");
              }
            });
          }
        }, 1000); // Chờ 1 giây rồi thử khôi phục
      }
    }

    // Kiểm tra nếu isRunning bị tắt
    if (oldState.isRunning && !currentTimerState.isRunning) {
      console.log("⏸️ [Content] TIMER BỊ DỪNG! Từ true -> false");
    }
  }

  if (dtk) {
    console.log("🎯 [Content] Bắt đầu xử lý task với DTK:", dtk);
    onMutation(dtk);
  } else if (request.action === "stateUpdate") {
    console.log("🔄 [Content] Nhận state update từ broadcast");
  }

  sendResponse({ success: true });
});
