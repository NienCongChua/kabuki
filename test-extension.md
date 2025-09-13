# Test Extension Guide

## Kiểm tra các lỗi đã sửa

### 1. Test lỗi "Could not establish connection"

**Trước khi sửa:**
- Extension báo lỗi "Could not establish connection. Receiving end does not exist"
- Lỗi xuất hiện trong console của background.js

**Sau khi sửa:**
- Background script có error handling khi gửi message
- Không còn lỗi connection trong console
- Message được gửi an toàn với callback

**Cách test:**
1. Mở Chrome DevTools
2. Vào tab Extensions
3. Click "Inspect views: service worker" cho extension
4. Reload trang EOP và kiểm tra console
5. Không còn thấy lỗi "Could not establish connection"

### 2. Test chức năng Auto Mode và Timer

**Trước khi sửa:**
- Nút Start/Stop trong popup không hoạt động
- Timer không ảnh hưởng đến việc giải bài tập
- Không có giao tiếp giữa popup và background script
- Extension vẫn tự động làm bài khi đã tạm dừng

**Sau khi sửa:**
- Timer hoạt động đầy đủ với UI đẹp
- Có thể set delay time tùy ý
- Timer state được đồng bộ giữa popup, background và content script
- **QUAN TRỌNG:** Khi tạm dừng (Pause), extension sẽ KHÔNG tự động làm bài
- Chỉ khi bấm Play, extension mới bật chế độ tự động

**Cách test:**
1. **Test chế độ tắt tự động:**
   - Mở popup extension
   - Đảm bảo trạng thái hiển thị "Tắt tự động"
   - Vào trang bài tập EOP
   - **Kiểm tra:** Extension KHÔNG tự động làm bài

2. **Test chế độ bật tự động:**
   - Set thời gian delay (ví dụ: 5 giây)
   - Click nút Play để bắt đầu
   - Trạng thái hiển thị "Tự động (Đang chạy)"
   - Vào trang bài tập EOP
   - **Kiểm tra:** Extension đợi 5 giây rồi tự động làm bài

3. **Test tạm dừng:**
   - Khi đang ở chế độ tự động, click nút Pause
   - Trạng thái chuyển về "Tắt tự động"
   - **Kiểm tra:** Extension ngừng tự động làm bài ngay lập tức

### 3. Test các loại bài tập

Extension hỗ trợ các loại bài tập sau:
- ✅ Vocabulary (default)
- ✅ Audio write word
- ✅ Pronunciation write word  
- ✅ Fill reading word blank
- ✅ Fill listening write answer
- ✅ Fill vocabulary block blank
- ✅ Fill grammar word blank
- ✅ Choose listening choose answer
- ✅ Choose reading choose answer
- ✅ View content
- ✅ Image choose word
- ✅ Audio choose word
- ✅ Word choose meaning
- ✅ Audio choose image
- ⚠️ Upload content (chỉ log, chưa implement)

## Checklist kiểm tra

### ✅ Tính năng cơ bản
- [ ] Extension load thành công không có lỗi
- [ ] Popup mở được và hiển thị đúng UI với vòng quay countdown
- [ ] **QUAN TRỌNG:** Khi "Tắt tự động" - Extension KHÔNG làm bài
- [ ] **QUAN TRỌNG:** Khi "Tự động" - Extension tự động làm bài

### ⏱️ Timer và Countdown
- [ ] Vòng quay hiển thị đúng progress (từ delay về 0)
- [ ] Số giây countdown chính xác
- [ ] Timer reset về delay ban đầu khi chuyển task mới
- [ ] Có thể thay đổi delay time (chỉ khi tắt auto mode)
- [ ] Popup đồng bộ real-time với background script

### 🔄 Auto Mode Control
- [ ] Bật auto mode: Cả autoMode và isRunning = true
- [ ] Tắt auto mode: Cả autoMode và isRunning = false
- [ ] Toast notifications hiển thị đúng message
- [ ] Chuyển đổi auto/manual mode hoạt động ngay lập tức
- [ ] Extension đợi đúng thời gian delay trước khi giải bài

### 🎯 Execution Logic
- [ ] Content script nhận được timer state đầy đủ
- [ ] Các loại bài tập được giải đúng
- [ ] Không có lỗi Canvas2D spam trong console
- [ ] Error boundary hoạt động khi có lỗi UI

## Lưu ý

- Extension chỉ hoạt động trên domain `eop.edu.vn/study/task/*`
- **Timer state được lưu trong Chrome Storage** (không dùng localStorage nữa)
- **Background script là single source of truth** cho timer state
- **Popup đồng bộ với background script** mỗi giây để đảm bảo consistency
- **Auto mode tự động tắt** khi restart extension để tránh auto chạy không mong muốn
- **Không có countdown timer** - chỉ hiển thị trạng thái auto/manual và delay setting

## Các vấn đề đã sửa trong version mới

### 1. Timer chạy trong background khi đã tạm dừng
- **Trước:** Timer vẫn countdown trong localStorage ngay cả khi tạm dừng
- **Sau:** Không có countdown timer, chỉ có auto mode on/off

### 2. Popup không đồng bộ với background
- **Trước:** Popup dùng localStorage riêng, không sync với background
- **Sau:** Popup sync với background script mỗi giây, đảm bảo state nhất quán

### 3. Extension tự động chạy khi restart
- **Trước:** Timer state được restore và có thể auto chạy
- **Sau:** Auto mode tự động tắt khi restart extension

### 4. Quá nhiều log spam
- **Trước:** Console đầy log không cần thiết
- **Sau:** Chỉ giữ lại log cần thiết cho debugging
