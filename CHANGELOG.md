# Changelog - EOP Extension

## Version 1.1.0 - Sửa lỗi Auto Mode

### 🔧 Vấn đề đã sửa

#### 1. Lỗi "Could not establish connection"
- **Vấn đề:** Background script gửi message đến content script khi chưa sẵn sàng
- **Giải pháp:** Thêm error handling với callback trong `chrome.tabs.sendMessage()`
- **File thay đổi:** `src/background.ts`

#### 2. Extension vẫn tự động làm bài khi đã tạm dừng
- **Vấn đề:** Logic chỉ kiểm tra delay time, không kiểm tra có nên thực hiện hay không
- **Giải pháp:** 
  - Thêm `autoMode` state để kiểm soát việc tự động làm bài
  - Khi Pause: `autoMode = false` → Extension KHÔNG làm bài
  - Khi Play: `autoMode = true` → Extension tự động làm bài với delay
- **File thay đổi:** `src/background.ts`, `src/content_script.tsx`, `src/components/EopTool.tsx`

### 🆕 Tính năng mới

#### Auto Mode Control
- **Trạng thái rõ ràng:**
  - "Tắt tự động" = Extension không làm gì
  - "Tự động (Đang chạy)" = Extension tự động làm bài với delay
- **Toast notifications:** Thông báo rõ ràng khi bật/tắt auto mode
- **Immediate effect:** Thay đổi có hiệu lực ngay lập tức

### 📝 Chi tiết thay đổi

#### Background Script (`src/background.ts`)
```typescript
// Thêm autoMode state
let timerState = {
  isRunning: false,
  delay: 30,
  startTime: 0,
  autoMode: false  // Mới thêm
};

// Cập nhật message handling
if (request.action === "start") {
  timerState.isRunning = true;
  timerState.autoMode = true;  // Bật auto mode
} else if (request.action === "stop") {
  timerState.isRunning = false;
  timerState.autoMode = false;  // Tắt auto mode
}
```

#### Content Script (`src/content_script.tsx`)
```typescript
// Kiểm tra auto mode trước khi làm bài
if (!currentTimerState.autoMode) {
  console.log("Auto mode is disabled. Manual solving required.");
  return;  // Không làm gì
}

// Chỉ làm bài khi auto mode = true
if (currentTimerState.isRunning) {
  await sleep(currentTimerState.delay);  // Có delay
} else {
  // Không delay nhưng vẫn làm bài (nếu auto mode bật)
}
executeTask(btnSubmit);
```

#### UI Component (`src/components/EopTool.tsx`)
```typescript
// Cập nhật text hiển thị
{isRunning ? "Tự động (Đang chạy)" : "Tắt tự động"}

// Cập nhật toast messages
title: newRunningState ? "Đã bật tự động" : "Đã tắt tự động"
description: newRunningState ? 
  `Chế độ tự động đã bật với độ trễ ${time} giây` : 
  "Chế độ tự động đã được tắt. Extension sẽ không tự động làm bài."
```

### 🧪 Cách test

1. **Test tắt auto mode:**
   - Đảm bảo popup hiển thị "Tắt tự động"
   - Vào trang EOP → Extension KHÔNG làm bài

2. **Test bật auto mode:**
   - Click Play → Popup hiển thị "Tự động (Đang chạy)"
   - Vào trang EOP → Extension tự động làm bài sau delay time

3. **Test chuyển đổi:**
   - Từ auto → manual: Click Pause → Extension ngừng làm bài ngay
   - Từ manual → auto: Click Play → Extension bắt đầu làm bài ngay

### 🎯 Kết quả

- ✅ Extension chỉ tự động làm bài khi người dùng muốn
- ✅ Không còn lỗi connection
- ✅ UI rõ ràng, dễ hiểu
- ✅ Hoạt động ổn định và đáng tin cậy
