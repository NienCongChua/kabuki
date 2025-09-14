# Debug Logs - Theo dõi vấn đề tự động tắt trạng thái

## 📋 Tóm tắt các log debug đã thêm

### 🔵 fillBlank.ts
- **Bắt đầu task**: Log khi fillBlank function được gọi
- **Tìm câu hỏi**: Log số lượng câu hỏi fill blank tìm thấy
- **Điền câu trả lời**: Log từng câu được điền
- **Click submit**: Log khi click submit button
- **Tìm button answer**: Log việc tìm kiếm button answer
- **OCR process**: Log chi tiết quá trình OCR từng hình ảnh
- **Điền đáp án chính xác**: Log việc điền đáp án sau khi OCR
- **Verify human popup**: Log khi phát hiện và xử lý popup verify human

### 🟠 chooseAnswer.ts
- **Bắt đầu task**: Log khi chooseAnswer function được gọi
- **Tìm câu hỏi**: Log số lượng câu hỏi tìm thấy
- **Chọn đáp án đầu tiên**: Log việc chọn đáp án đầu tiên cho mỗi câu
- **Xem đáp án**: Log việc click button answer để xem đáp án đúng
- **Phát hiện đáp án đúng**: Log các radio button được checked
- **Chọn đáp án đúng**: Log việc chọn lại các đáp án đúng
- **Verify human popup**: Log xử lý popup verify human

### 🟡 vocabulary.ts
- **Bắt đầu task**: Log khi vocabulary function được gọi
- **Tìm từ vựng**: Log số lượng từ vựng tìm thấy
- **Khôi phục localStorage**: Log việc tải từ vựng từ localStorage
- **Xử lý từng từ**: Log việc click audio và xử lý từng từ vựng
- **Thêm từ mới**: Log khi thêm từ vựng mới vào danh sách
- **Lưu localStorage**: Log việc lưu danh sách từ vựng
- **Random delay**: Log thời gian chờ ngẫu nhiên trước submit

### 🟣 writeWord.ts
- **Bắt đầu task**: Log khi writeWord function được gọi
- **Tìm câu hỏi**: Log số lượng câu hỏi writeWord
- **Kiểm tra localStorage**: Log việc tải từ vựng từ localStorage
- **Phân tích ký tự**: Log các ký tự có sẵn để ghép từ
- **Tìm từ khớp**: Log việc tìm từ vựng khớp với các ký tự
- **Click ký tự**: Log từng ký tự được click theo thứ tự
- **Hoàn thành câu**: Log khi chuyển sang câu tiếp theo

### 🟢 chooseWord.ts
- **Bắt đầu task**: Log khi chooseWord function được gọi
- **Tìm câu hỏi**: Log số lượng câu hỏi chooseWord
- **Tìm đáp án**: Log các lựa chọn đáp án có sẵn
- **Thử từng đáp án**: Log việc thử từng đáp án
- **Kiểm tra kết quả**: Log đáp án đúng/sai
- **Hoàn thành câu**: Log khi chuyển sang câu tiếp theo

### 🟢 background.ts
- **Khởi động**: Log khi background script khởi động
- **Khôi phục state**: Log việc khôi phục state từ storage
- **Reset autoMode**: Log khi reset autoMode về false khi restart extension
- **Lưu state**: Log mỗi khi lưu state vào storage
- **Tab updated**: Log khi tab được cập nhật và chuyển task
- **Reset timer**: Log khi reset timer cho task mới
- **Gửi message**: Log việc gửi message tới content script
- **Start/Stop actions**: Log chi tiết khi bắt đầu/dừng auto mode
- **Broadcast**: Log việc broadcast state tới tất cả tabs

### 🔄 content_script.tsx
- **Nhận message**: Log khi nhận message từ background
- **Cập nhật state**: Log chi tiết việc cập nhật timer state
- **Phát hiện thay đổi**: Log khi autoMode hoặc isRunning bị thay đổi
- **onMutation**: Log chi tiết quá trình xử lý task
- **Kiểm tra điều kiện**: Log việc kiểm tra autoMode và isRunning
- **sleepWithStateCheck**: Log chi tiết quá trình chờ với kiểm tra state
- **executeTask**: Log việc xác định và thực hiện loại task

## 🎯 Mục đích của các log

### 1. Theo dõi việc reset autoMode
```
🟡 [Background] RESET autoMode và isRunning về false khi restart extension
```
- Xác định khi nào extension bị restart và reset state

### 2. Theo dõi thay đổi state
```
🛑 [Content] AUTO MODE BỊ TẮT! Từ true -> false
⏸️ [Content] TIMER BỊ DỪNG! Từ true -> false
```
- Phát hiện khi nào autoMode hoặc isRunning bị thay đổi bất ngờ

### 3. Theo dõi quá trình chờ
```
⏳ [Content] Đã chờ X giây, còn Y giây
🛑 [Content] sleepWithStateCheck bị dừng - State thay đổi
```
- Xác định nếu state thay đổi trong quá trình chờ

### 4. Theo dõi điều kiện thực hiện
```
🔍 [Content] autoMode: true isRunning: true
🛑 [Content] KHÔNG THỰC HIỆN - Auto mode tắt hoặc timer không chạy
```
- Xác định tại sao task không được thực hiện

## 🔧 Cách sử dụng

1. **Mở Developer Tools** (F12)
2. **Chuyển sang tab Console**
3. **Bật auto mode** và quan sát logs
4. **Tìm kiếm các pattern**:
   - `🛑` - Khi có vấn đề hoặc dừng
   - `🟡` - Cảnh báo quan trọng
   - `🔄` - Thay đổi state
   - `⏳` - Quá trình chờ

## 🚨 Các dấu hiệu cần chú ý

### Extension bị restart không mong muốn
```
🟢 [Background] Background script khởi động
🟡 [Background] RESET autoMode và isRunning về false khi restart extension
```

### State thay đổi bất ngờ
```
🛑 [Content] AUTO MODE BỊ TẮT! Từ true -> false
```

### Bị dừng trong quá trình chờ
```
🛑 [Content] sleepWithStateCheck bị dừng - State thay đổi
```

### Không thực hiện task
```
🛑 [Content] KHÔNG THỰC HIỆN - Auto mode tắt hoặc timer không chạy
```

## 📝 Ghi chú

- Tất cả console.log trong production đã được tạm thời bật để debug
- Sau khi tìm ra nguyên nhân, cần tắt lại các log này
- Các log được đánh dấu bằng emoji để dễ phân biệt và tìm kiếm
