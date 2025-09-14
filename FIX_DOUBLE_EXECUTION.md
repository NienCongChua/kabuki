# 🔧 Fix: Vấn đề click 2 lần / thực hiện đồng thời

## 🚨 **Vấn đề phát hiện:**

Từ logs thấy có **2 lần thực hiện fillBlank cùng lúc**:
```
🔵 [fillBlank] Tìm kiếm button answer với ID: answer28a580bbe9
🔵 [fillBlank] Tìm thấy button answer, chờ 30 giây để xem đáp án
🔵 [fillBlank] Tìm kiếm button answer với ID: answer28a580bbe9  ← Lặp lại
🔵 [fillBlank] Tìm thấy button answer, chờ 30 giây để xem đáp án  ← Lặp lại
```

## 🔍 **Nguyên nhân có thể:**

1. **Function được gọi 2 lần** từ content script
2. **Race condition** khi có nhiều message events
3. **Button submit được click nhiều lần** gây trigger multiple executions
4. **Tab navigation** gây ra multiple function calls

## ✅ **Giải pháp: Guard Mechanism**

Thêm **guard flags** cho tất cả task scripts để tránh chạy đồng thời:

### **1. fillBlank.ts**
```typescript
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
  
  try {
    // ... logic fillBlank
  } catch (error) {
    console.log("❌ [fillBlank] Lỗi trong quá trình thực hiện:", error);
  } finally {
    // Reset flag khi hoàn thành hoặc có lỗi
    fillBlankRunning = false;
    console.log("🔵 [fillBlank] Reset fillBlankRunning flag");
  }
};
```

### **2. chooseAnswer.ts**
```typescript
let chooseAnswerRunning = false;
// Tương tự logic guard
```

### **3. vocabulary.ts**
```typescript
let vocabularyRunning = false;
// Tương tự logic guard
```

### **4. writeWord.ts**
```typescript
let writeWordRunning = false;
// Tương tự logic guard
```

### **5. chooseWord.ts**
```typescript
let chooseWordRunning = false;
// Tương tự logic guard
```

## 🎯 **Cách hoạt động:**

1. **Lần gọi đầu tiên**: Set flag = true, thực hiện task
2. **Lần gọi thứ 2** (nếu có): Thấy flag = true → SKIP
3. **Hoàn thành**: Reset flag = false trong finally block
4. **Có lỗi**: Vẫn reset flag = false để không bị stuck

## 🛡️ **Lợi ích:**

1. **Tránh duplicate execution**: Chỉ 1 instance chạy tại 1 thời điểm
2. **Tránh race conditions**: Không có conflict giữa các lần gọi
3. **Error handling**: Finally block đảm bảo flag luôn được reset
4. **Debug friendly**: Log rõ ràng khi skip execution

## 📊 **Logs để theo dõi:**

### **Bình thường (1 lần gọi):**
```
🔵 [fillBlank] Bắt đầu thực hiện fillBlank task
🔵 [fillBlank] ... (các bước thực hiện)
🔵 [fillBlank] Reset fillBlankRunning flag
```

### **Skip duplicate call:**
```
🔵 [fillBlank] Bắt đầu thực hiện fillBlank task
⚠️ [fillBlank] SKIP - fillBlank đang chạy, bỏ qua lần gọi này  ← Duplicate bị skip
🔵 [fillBlank] Reset fillBlankRunning flag
```

### **Error handling:**
```
🔵 [fillBlank] Bắt đầu thực hiện fillBlank task
❌ [fillBlank] Lỗi trong quá trình thực hiện: [error details]
🔵 [fillBlank] Reset fillBlankRunning flag  ← Vẫn reset flag
```

## 🧪 **Test Cases:**

### **Test 1: Normal execution**
1. Trigger fillBlank 1 lần
2. Thấy logs bình thường, không có SKIP
3. Task hoàn thành đúng

### **Test 2: Duplicate prevention**
1. Trigger fillBlank 2 lần nhanh liên tiếp
2. Lần 1: Thực hiện bình thường
3. Lần 2: Thấy "SKIP - đang chạy, bỏ qua"

### **Test 3: Error recovery**
1. Trigger fillBlank với lỗi (ví dụ: không tìm thấy element)
2. Thấy error log
3. Flag vẫn được reset, lần gọi tiếp theo hoạt động bình thường

## 🔄 **Tương lai:**

Nếu vẫn có vấn đề, có thể:
1. **Thêm timeout** cho guard flags (auto-reset sau X giây)
2. **Global guard** cho tất cả task scripts
3. **Queue mechanism** thay vì skip
4. **Debounce** function calls

## 📝 **Ghi chú:**

- Guard flags là **module-level variables**, persist trong suốt session
- **Finally block** đảm bảo flag luôn được reset
- **Try-catch** bắt mọi lỗi để tránh flag bị stuck
- Logs giúp debug và monitor hiệu quả của fix
