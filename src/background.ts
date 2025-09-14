// Tắt tất cả console.log trong production (TẠM THỜI BẬT ĐỂ DEBUG)
// if (typeof console !== 'undefined') {
//   console.log = () => {};
//   console.warn = () => {};
//   console.info = () => {};
// }

console.log("🟢 [Background] Background script khởi động");

// Lưu trạng thái timer và auto mode
let timerState = {
  isRunning: false,
  delay: 30,
  startTime: 0,
  autoMode: false,
  remainingTime: 30,
  currentTaskId: null as string | null,
  pausedTime: 0 // Thời gian đã pause
};

// Khôi phục state từ storage khi background script khởi động
chrome.storage.local.get(['timerState'], (result) => {
  console.log("🟢 [Background] Khôi phục state từ storage:", result.timerState);

  if (result.timerState) {
    const oldState = { ...timerState };
    timerState = { ...timerState, ...result.timerState };

    console.log("🟢 [Background] State trước khi reset:", oldState);
    console.log("🟢 [Background] State sau khi khôi phục:", timerState);

    // Reset auto mode khi restart extension để tránh auto chạy không mong muốn
    timerState.autoMode = false;
    timerState.isRunning = false;

    console.log("🟡 [Background] RESET autoMode và isRunning về false khi restart extension");
    console.log("🟢 [Background] State cuối cùng:", timerState);

    saveTimerState();
  } else {
    console.log("🟢 [Background] Không có state trong storage, sử dụng state mặc định");
  }
});

// Lưu state vào storage
function saveTimerState() {
  console.log("💾 [Background] Lưu state vào storage:", timerState);
  chrome.storage.local.set({ timerState });
}

chrome.tabs.onUpdated.addListener(function (_tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" && tab.url?.includes("eop.edu.vn/study/task/")) {
    let id = tab.url?.split("?id=")[1];
    console.log("🔄 [Background] Tab updated - Task ID:", id, "Current Task ID:", timerState.currentTaskId);
    console.log("🔄 [Background] Tab URL:", tab.url);
    console.log("🔄 [Background] Change info:", changeInfo);
    console.log("🔄 [Background] Current autoMode:", timerState.autoMode, "isRunning:", timerState.isRunning);

    // Reset timer khi chuyển task mới
    if (id && id !== timerState.currentTaskId) {
      console.log("🔄 [Background] Chuyển sang task mới:", id);
      console.log("🔄 [Background] State trước khi reset:", timerState);

      // LƯU LẠI autoMode và isRunning trước khi reset
      const preserveAutoMode = timerState.autoMode;
      const preserveIsRunning = timerState.isRunning;

      timerState.currentTaskId = id;
      // Reset về delay ban đầu khi chuyển task
      timerState.remainingTime = timerState.delay;

      // QUAN TRỌNG: Giữ nguyên autoMode và isRunning khi chuyển task
      timerState.autoMode = preserveAutoMode;
      timerState.isRunning = preserveIsRunning;

      // Luôn reset startTime khi chuyển task để đảm bảo tính toán chính xác
      if (timerState.autoMode && timerState.isRunning) {
        timerState.startTime = Date.now();
        console.log("🔄 [Background] Reset startTime cho task mới (auto mode đang chạy)");
      } else {
        // Ngay cả khi không running, cũng cần set startTime để tính toán đúng
        timerState.startTime = Date.now();
        console.log("🔄 [Background] Reset startTime cho task mới (auto mode tắt)");
      }

      console.log("🔄 [Background] State sau khi reset (GIỮ NGUYÊN autoMode):", timerState);
      console.log("🔄 [Background] autoMode preserved:", preserveAutoMode, "→", timerState.autoMode);
      console.log("🔄 [Background] isRunning preserved:", preserveIsRunning, "→", timerState.isRunning);

      saveTimerState();
    }

    // Gửi message với delay để đảm bảo content script đã load
    setTimeout(() => {
      try {
        console.log("📤 [Background] Gửi message tới content script:", { id, timerState });
        chrome.tabs.sendMessage(tab.id!, { id, timerState }, (_response) => {
          if (chrome.runtime.lastError) {
            console.log("❌ [Background] Lỗi gửi message:", chrome.runtime.lastError.message);
          } else {
            console.log("✅ [Background] Message đã gửi thành công");
          }
        });
      } catch (error) {
        console.log("❌ [Background] Exception khi gửi message:", error);
      }
    }, 100);
  }
});

// Xử lý message từ popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log("📨 [Background] Nhận message từ popup:", request);

  if (request.action === "start") {
    console.log("▶️ [Background] Bắt đầu auto mode");
    console.log("▶️ [Background] State trước khi start:", timerState);

    timerState.autoMode = true;
    timerState.isRunning = true;

    // Nếu đang resume, tính lại startTime dựa trên remainingTime
    if (timerState.remainingTime < timerState.delay) {
      timerState.startTime = Date.now() - (timerState.delay - timerState.remainingTime) * 1000;
      console.log("▶️ [Background] Resume từ remainingTime:", timerState.remainingTime);
    } else {
      // Start mới
      timerState.startTime = Date.now();
      timerState.remainingTime = timerState.delay;
      console.log("▶️ [Background] Start mới với delay:", timerState.delay);
    }

    console.log("▶️ [Background] State sau khi start:", timerState);
    saveTimerState();

    // Gửi state mới cho tất cả content scripts
    broadcastToAllTabs();

    sendResponse({ success: true, state: timerState });
  } else if (request.action === "stop") {
    console.log("⏹️ [Background] Dừng auto mode");
    console.log("⏹️ [Background] State trước khi stop:", timerState);

    // Tính remaining time trước khi dừng
    if (timerState.isRunning && timerState.autoMode) {
      const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
      timerState.remainingTime = Math.max(0, timerState.delay - elapsed);
      console.log("⏹️ [Background] Tính remaining time:", {
        elapsed,
        remainingTime: timerState.remainingTime
      });
    }

    timerState.autoMode = false;
    timerState.isRunning = false;

    console.log("⏹️ [Background] State sau khi stop:", timerState);
    saveTimerState();

    // Gửi state mới cho tất cả content scripts
    broadcastToAllTabs();

    sendResponse({ success: true, state: timerState });
  } else if (request.action === "setDelay") {
    console.log("⚙️ [Background] Thay đổi delay từ", timerState.delay, "thành", request.delay);
    timerState.delay = request.delay;
    timerState.remainingTime = request.delay;
    saveTimerState();
    sendResponse({ success: true, state: timerState });
  } else if (request.action === "getState") {
    // Cập nhật remaining time nếu đang chạy
    if (timerState.isRunning && timerState.autoMode) {
      const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
      timerState.remainingTime = Math.max(0, timerState.delay - elapsed);
    }
    console.log("📊 [Background] Gửi state hiện tại:", timerState);
    sendResponse({ success: true, state: timerState });
  }

  return true; // Giữ message channel mở cho async response
});

// Function để broadcast state cho tất cả tabs
function broadcastToAllTabs() {
  console.log("📡 [Background] Broadcasting state tới tất cả tabs:", timerState);

  chrome.tabs.query({ url: "*://eop.edu.vn/study/task/*" }, (tabs) => {
    console.log("📡 [Background] Tìm thấy", tabs.length, "tabs EOP");

    tabs.forEach(tab => {
      if (tab.id) {
        try {
          console.log("📡 [Background] Gửi state update tới tab:", tab.id);
          chrome.tabs.sendMessage(tab.id, {
            id: tab.url?.split("?id=")[1],
            timerState
          }, (_response) => {
            if (chrome.runtime.lastError) {
              console.log("❌ [Background] Lỗi broadcast tới tab", tab.id, ":", chrome.runtime.lastError.message);
            } else {
              console.log("✅ [Background] Broadcast thành công tới tab:", tab.id);
            }
          });
        } catch (error) {
          console.log("❌ [Background] Exception khi broadcast tới tab", tab.id, ":", error);
        }
      }
    });
  });
}
