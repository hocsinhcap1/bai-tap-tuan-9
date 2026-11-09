# Phiếu bài tập cuối tuần (Toán tuần 7 + Tiếng Việt)

Trang web tĩnh cho học sinh làm bài trực tiếp. Học sinh chỉ điền **họ tên + lớp** rồi bấm Nộp.
Bài nộp được ghi vào **Google Sheet** của giáo viên (miễn phí, không cần máy chủ).

## Cài đặt (khoảng 5 phút)

### 1. Tạo nơi nhận bài
1. Tạo một Google Sheet mới (ví dụ "Bài nộp tuần 7").
2. Menu **Tiện ích mở rộng (Extensions) → Apps Script**.
3. Xoá code mẫu, dán toàn bộ nội dung `apps-script/Code.gs`, bấm Lưu.
4. Bấm **Triển khai (Deploy) → Tùy chọn triển khai mới → loại "Ứng dụng web"**:
   - Thực thi dưới tư cách: **Tôi**
   - Ai có quyền truy cập: **Bất kỳ ai**
5. Bấm Triển khai, cấp quyền khi được hỏi, rồi **sao chép URL Web App** (dạng `https://script.google.com/macros/s/.../exec`).

### 2. Gắn URL vào trang
Mở `index.html`, tìm dòng `const ENDPOINT=` và thay `DÁN_URL_APPS_SCRIPT_VÀO_ĐÂY` bằng URL vừa sao chép.

### 3. Đưa lên GitHub
1. Tạo repository mới, tải `index.html` (và `README.md`) lên.
2. **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. Sau ít phút, link trang có dạng `https://<tên-github>.github.io/<tên-repo>/`. Gửi link này cho học sinh.

## Lưu ý
- Nếu sửa `Code.gs` sau này, phải **Triển khai → Quản lý triển khai → Chỉnh sửa → Phiên bản mới** thì mới có hiệu lực.
- Nếu gửi không được, học sinh có nút "Sao chép bài làm" để gửi qua Zalo.
- Câu "…ông nhà" (s/x, câu 1) chưa có đáp án nên không tự chấm.
- Không dùng tên và lớp thật quá chi tiết nếu repo công khai: dữ liệu học sinh chỉ nằm trong Google Sheet, không nằm trong repo.
