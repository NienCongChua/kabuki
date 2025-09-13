# EOP Easier Extension

Extension Chrome tự động giải bài tập trên EOP với tính năng timer có thể tùy chỉnh.

## Tính năng

- ✅ Tự động giải các loại bài tập EOP
- ⏱️ Timer có thể tùy chỉnh độ trễ
- 🎯 Giao diện đẹp với animation
- 🔧 Xử lý lỗi connection tốt hơn

## Cách sử dụng

1. **Cài đặt Extension:**
   - Build extension: `npm run build`
   - Mở Chrome Extensions (chrome://extensions/)
   - Bật Developer mode
   - Click "Load unpacked" và chọn thư mục `dist`

2. **Sử dụng Timer:**
   - Click vào icon extension trên toolbar
   - Nhập thời gian delay (giây) trong ô "Độ trễ"
   - Click nút Play để bắt đầu timer
   - Click nút Pause để dừng timer

3. **Tự động giải bài:**
   - Truy cập trang bài tập EOP
   - Extension sẽ tự động phát hiện và giải bài
   - Nếu timer đang chạy, sẽ đợi theo thời gian đã set

## Các lỗi đã sửa

### 1. Lỗi "Could not establish connection"
- **Nguyên nhân:** Background script gửi message đến content script khi chưa sẵn sàng
- **Giải pháp:** Thêm error handling và callback để xử lý lỗi connection

### 2. Timer không hoạt động
- **Nguyên nhân:** Popup và background script không giao tiếp được
- **Giải pháp:**
  - Thêm message handling trong background script
  - Kết nối EopTool component với background script
  - Đồng bộ timer state giữa popup và content script

## Cấu trúc code

```
src/
├── background.ts          # Service worker xử lý timer state
├── content_script.tsx     # Script chạy trên trang EOP
├── popup.tsx             # Popup chính
├── components/
│   └── EopTool.tsx       # Component timer UI
└── scripts/              # Các script giải bài tập
    ├── chooseAnswer.ts
    ├── chooseWord.ts
    ├── fillBlank.ts
    ├── vocabulary.ts
    └── writeWord.ts
```

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)

## Development

```bash
# Install dependencies
npm install

# Build for development
npm run dev

# Build for production
npm run build

# Clean build
npm run clean

# Watch mode
npm run watch

# Test
npm run test
```

## Load extension to chrome

1. Mở Chrome và truy cập `chrome://extensions/`
2. Bật "Developer mode" ở góc trên bên phải
3. Click "Load unpacked" và chọn thư mục `dist`
4. Extension sẽ xuất hiện trong danh sách và sẵn sàng sử dụng
