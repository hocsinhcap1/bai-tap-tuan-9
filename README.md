# Phiếu bài tập cuối tuần (Toán tuần 7 + Tiếng Việt)

Trang web tĩnh cho học sinh làm bài trực tiếp. Học sinh chỉ điền **họ tên + lớp** rồi bấm Nộp.
Bài nộp được ghi vào **Google Sheet** của giáo viên (miễn phí, không cần máy chủ).

## Cài đặt (khoảng 5 phút)

### 1. Tạo nơi nhận bài
1. Tạo một Google Sheet mới (ví dụ "Bài nộp tuần 7").
2. Menu **Tiện ích mở rộng (Extensions) → Apps Script**.
3. Xoá code mẫu, dán toàn bộ nội dung file `Code.gs` (nằm ngoài thư mục github), bấm Lưu.
4. Bấm **Triển khai (Deploy) → Tùy chọn triển khai mới → loại "Ứng dụng web"**:
   - Thực thi dưới tư cách: **Tôi**
   - Ai có quyền truy cập: **Bất kỳ ai**
5. Bấm Triển khai, cấp quyền khi được hỏi, rồi **sao chép URL Web App** (dạng `https://script.google.com/macros/s/.../exec`).

### 2. Gắn URL vào trang
Mở `index.html`, tìm dòng `const ENDPOINT=` và thay `DÁN_URL_APPS_SCRIPT_VÀO_ĐÂY` bằng URL vừa sao chép.

### 3. Đưa lên GitHub
1. Tạo repository mới, tải `index.html` (và `README.md`) lên. **Không tải `Code.gs` lên**, vì file đó chứa mật khẩu giáo viên.
2. **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. Sau ít phút, link trang có dạng `https://<tên-github>.github.io/<tên-repo>/`. Gửi link này cho học sinh.

## Nhận email thống kê
Trong `Code.gs`, sửa 2 dòng đầu:
- `TEACHER_EMAIL`: email của bạn.
- `NOTIFY`: `"each"` = mỗi bài nộp một email (tên, lớp, số câu đã làm); `"daily"` = một email tổng hợp mỗi ngày lúc 18h (chọn cách này thì chạy hàm `installDailyTrigger` một lần trong Apps Script); `"off"` = không gửi.
- Lần đầu triển khai, Google sẽ hỏi quyền gửi email, hãy cho phép. Sau khi sửa `Code.gs` nhớ triển khai phiên bản mới.
- Gmail cá nhân gửi được khoảng 100 email/ngày, lớp đông nên dùng `"daily"`.

## Xem bài đã nộp
- Cách 1: mở Google Sheet, có đủ đáp án từng câu.
- Cách 2: cuối trang web có khung **Khu vực giáo viên**, nhập mật khẩu (đặt ở dòng `TEACHER_PASSWORD` trong `Code.gs`) để xem danh sách bài, điểm và câu sai. Mật khẩu được kiểm tra ở Apps Script, không nằm trong trang web.
- Nếu trước đó đã nộp thử bằng bản cũ, hãy xoá tab "Bài nộp" trong Sheet để cột tiêu đề được tạo lại đúng.

## Lưu ý
- Nếu sửa `Code.gs` sau này, phải **Triển khai → Quản lý triển khai → Chỉnh sửa → Phiên bản mới** thì mới có hiệu lực.
- Nếu gửi không được, học sinh có nút "Sao chép bài làm" để gửi qua Zalo.
- Câu "…ông nhà" (s/x, câu 1) chưa rõ đáp án nên đang chấp nhận cả s và x. Sửa ở dòng `v1_8` trong `index.html` nếu cần.
- Không dùng tên và lớp thật quá chi tiết nếu repo công khai: dữ liệu học sinh chỉ nằm trong Google Sheet, không nằm trong repo.
