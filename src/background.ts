// Tắt tất cả console.log trong production
if (typeof console !== 'undefined') {
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
}

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
  if (result.timerState) {
    timerState = { ...timerState, ...result.timerState };
    // Reset auto mode khi restart extension để tránh auto chạy không mong muốn
    timerState.autoMode = false;
    timerState.isRunning = false;
    saveTimerState();
  }
});

// Lưu state vào storage
function saveTimerState() {
  chrome.storage.local.set({ timerState });
}

chrome.tabs.onUpdated.addListener(function (_tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" && tab.url?.includes("eop.edu.vn/study/task/")) {
    let id = tab.url?.split("?id=")[1];

    // Reset timer khi chuyển task mới
    if (id && id !== timerState.currentTaskId) {
      timerState.currentTaskId = id;
      // Reset về delay ban đầu khi chuyển task
      timerState.remainingTime = timerState.delay;
      if (timerState.autoMode && timerState.isRunning) {
        timerState.startTime = Date.now();
      }
      saveTimerState();
    }

    // Gửi message với delay để đảm bảo content script đã load
    setTimeout(() => {
      try {
        chrome.tabs.sendMessage(tab.id!, { id, timerState }, (_response) => {
          if (chrome.runtime.lastError) {
            // Silent error handling
          }
        });
      } catch {
        // Silent catch
      }
    }, 100);
  }
});

// Xử lý message từ popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "start") {
    timerState.autoMode = true;
    timerState.isRunning = true;

    // Nếu đang resume, tính lại startTime dựa trên remainingTime
    if (timerState.remainingTime < timerState.delay) {
      timerState.startTime = Date.now() - (timerState.delay - timerState.remainingTime) * 1000;
    } else {
      // Start mới
      timerState.startTime = Date.now();
      timerState.remainingTime = timerState.delay;
    }

    saveTimerState();

    // Gửi state mới cho tất cả content scripts
    broadcastToAllTabs();

    sendResponse({ success: true, state: timerState });
  } else if (request.action === "stop") {
    // Tính remaining time trước khi dừng
    if (timerState.isRunning && timerState.autoMode) {
      const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
      timerState.remainingTime = Math.max(0, timerState.delay - elapsed);
    }

    timerState.autoMode = false;
    timerState.isRunning = false;
    saveTimerState();

    // Gửi state mới cho tất cả content scripts
    broadcastToAllTabs();

    sendResponse({ success: true, state: timerState });
  } else if (request.action === "setDelay") {
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
    sendResponse({ success: true, state: timerState });
  }

  return true; // Giữ message channel mở cho async response
});

// Function để broadcast state cho tất cả tabs
function broadcastToAllTabs() {
  chrome.tabs.query({ url: "*://eop.edu.vn/study/task/*" }, (tabs) => {
    tabs.forEach(tab => {
      if (tab.id) {
        try {
          chrome.tabs.sendMessage(tab.id, {
            id: tab.url?.split("?id=")[1],
            timerState
          }, (_response) => {
            if (chrome.runtime.lastError) {
              // Silent error handling
            }
          });
        } catch {
          // Silent catch
        }
      }
    });
  });
}
