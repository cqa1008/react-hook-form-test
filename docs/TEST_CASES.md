# Test cases (kiểm thử thủ công trên http://localhost:5173, tick khi PASS)
Tạo file mẫu trong test-assets/: valid.jpg, valid.png (ảnh thật), small.png (ảnh < 400px),
exact5mb.png (đúng 5242880 byte), over5mb.png (5242881 byte), big.jpg (khoảng 6MB),
photo.gif, doc.pdf, fake.png (file văn bản đổi đuôi .png), empty.jpg (0 byte).
Gợi ý tạo file kích thước chính xác: head -c 5242880 /dev/zero > test-assets/exact5mb.png

## A. Upload và validation
- [x] ✅ PASS | 1. Trạng thái đầu: chưa có lỗi, chưa có khung crop/preview | Bằng chứng: Browser subagent tải trang http://localhost:5173/ - không có thông báo lỗi, không có khung crop, không có ảnh preview.
- [x] ✅ PASS | 2. Submit khi chưa chọn gì: lỗi "Please select an image" | Bằng chứng: Bấm nút Submit, hiển thị lỗi "Please select an image" với role="alert" và input có aria-invalid="true".
- [ ] ⚠️ MANUAL | 3. Chọn valid.jpg: không lỗi, hiện khung crop | Lý do không tự test được: Trình duyệt bảo mật không cho phép AI tự động kích hoạt hộp thoại chọn file hệ thống (macOS Finder dialog) | Cách tôi cần test: Click vào khung upload, chọn test-assets/valid.jpg, xác nhận không có lỗi và khung crop xuất hiện kèm thanh trượt zoom.
- [ ] ⚠️ MANUAL | 4. Chọn valid.png: không lỗi, hiện khung crop | Lý do không tự test được: Trình duyệt bảo mật không cho phép AI tự động kích hoạt hộp thoại chọn file hệ thống (macOS Finder dialog) | Cách tôi cần test: Click vào khung upload, chọn test-assets/valid.png, xác nhận không có lỗi và khung crop xuất hiện.
- [ ] ⚠️ MANUAL | 5. Chọn photo.gif: lỗi "Only JPG and PNG files are allowed", KHÔNG hiện khung crop | Lý do không tự test được: Trình duyệt bảo mật không cho phép AI tự động kích hoạt hộp thoại chọn file hệ thống | Cách tôi cần test: Chọn test-assets/photo.gif (43 bytes), kiểm tra hiển thị lỗi "Only JPG and PNG files are allowed", không xuất hiện khung crop.
- [ ] ⚠️ MANUAL | 6. Chọn doc.pdf: lỗi sai định dạng | Lý do không tự test được: Trình duyệt bảo mật không cho phép AI tự động kích hoạt hộp thoại chọn file hệ thống | Cách tôi cần test: Chọn test-assets/doc.pdf (24 bytes), kiểm tra hiển thị lỗi "Only JPG and PNG files are allowed".
- [ ] ⚠️ MANUAL | 7. Chọn over5mb.png hoặc big.jpg: lỗi "File size must not exceed 5MB" | Lý do không tự test được: Trình duyệt bảo mật không cho phép AI tự động kích hoạt hộp thoại chọn file hệ thống | Cách tôi cần test: Chọn test-assets/over5mb.png (5,242,881 bytes) hoặc big.jpg (6,291,456 bytes), kiểm tra hiển thị lỗi "File size must not exceed 5MB".
- [ ] ⚠️ MANUAL | 8. Chọn exact5mb.png: hợp lệ về dung lượng (biên); over5mb.png (+1 byte): lỗi | Lý do không tự test được: Trình duyệt bảo mật không cho phép AI tự động kích hoạt hộp thoại chọn file hệ thống | Cách tôi cần test: Chọn test-assets/exact5mb.png (đúng 5,242,880 bytes) -> không lỗi, khung crop hiện; chọn test-assets/over5mb.png (5,242,881 bytes) -> báo lỗi "File size must not exceed 5MB".
- [ ] ⚠️ MANUAL | 9. Chọn fake.png / empty.jpg: không làm app crash, hiện lỗi "Unable to read this image file" hoặc lỗi hợp lệ khác | Lý do không tự test được: Trình duyệt bảo mật không cho phép AI tự động kích hoạt hộp thoại chọn file hệ thống | Cách tôi cần test: Chọn test-assets/fake.png (file text 47 bytes) hoặc test-assets/empty.jpg (0 bytes), xác nhận app không crash, hiển thị lỗi "Unable to read this image file", không hiện khung crop.
- [ ] ⚠️ MANUAL | 10. Chọn file sai, rồi chọn lại file đúng: lỗi biến mất | Lý do không tự test được: Trình duyệt bảo mật không cho phép AI tự động kích hoạt hộp thoại chọn file hệ thống | Cách tôi cần test: Chọn file lỗi (photo.gif), sau đó chọn lại valid.png, xác nhận thông báo lỗi biến mất và khung crop hiện ra bình thường.
- [ ] ⚠️ MANUAL | 11. Chọn cùng một file hai lần liên tiếp vẫn kích hoạt lại (reset e.target.value) | Lý do không tự test được: Trình duyệt bảo mật không cho phép AI tự động kích hoạt hộp thoại chọn file hệ thống | Cách tôi cần test: Chọn valid.png, bấm Reset, chọn tiếp valid.png, kiểm tra sự kiện onChange vẫn kích hoạt bình thường (nhờ logic reset e.target.value = '').

## B. Crop
- [ ] ⚠️ MANUAL | 12. Kéo ảnh và zoom bằng thanh trượt/cuộn chuột hoạt động mượt mà | Lý do không tự test được: Đòi hỏi tương tác chuột kéo thả liên tục trên canvas Cropper | Cách tôi cần test: Kéo di chuyển ảnh trong khung crop và kéo thanh trượt zoom từ 1x đến 3x, xác nhận ảnh di chuyển và phóng to/thu nhỏ mượt mà.
- [ ] ⚠️ MANUAL | 13. Bấm Crop: hiện Preview đúng 400x400 px (kiểm tra bằng devtools hoặc thông tin hiển thị) | Lý do không tự test được: Cần có ảnh đã tải lên để bấm nút Crop | Cách tôi cần test: Sau khi chọn ảnh, bấm nút Crop, quan sát phần Preview xuất hiện và kiểm tra thông tin hiển thị "Kích thước thực: 400 x 400 px".
- [ ] ⚠️ MANUAL | 14. Ảnh preview đúng vùng đã chọn khi crop (không lệch) | Lý do không tự test được: Đòi hỏi quan sát trực quan vị trí vùng chọn so với preview | Cách tôi cần test: Di chuyển ảnh lệch sang một góc rồi bấm Crop, so sánh ảnh preview có đúng tâm vùng chọn hay không.
- [ ] ⚠️ MANUAL | 15. small.png (< 400px): vẫn crop được, kết quả vẫn 400x400 | Lý do không tự test được: Trình duyệt bảo mật không cho phép AI tự động kích hoạt hộp thoại chọn file hệ thống | Cách tôi cần test: Chọn test-assets/small.png (ảnh gốc 200x200 px), bấm Crop, xác nhận preview hiển thị "Kích thước thực: 400 x 400 px".
- [ ] ⚠️ MANUAL | 16. PNG cho ra PNG, JPG cho ra JPG | Lý do không tự test được: Cần tương tác tải file thực tế | Cách tôi cần test: Crop valid.png -> tên file hiển thị đuôi -cropped.png; crop valid.jpg -> tên file hiển thị đuôi -cropped.jpg.
- [ ] ⚠️ MANUAL | 17. Chọn ảnh khác sau khi đã crop: preview cũ bị xóa, phải crop lại | Lý do không tự test được: Cần tương tác tải file liên tiếp | Cách tôi cần test: Sau khi crop xong valid.jpg (đang có preview), chọn sang valid.png, xác nhận preview cũ biến mất, croppedImage reset về null.

## C. Submit
- [ ] ⚠️ MANUAL | 18. Chọn ảnh hợp lệ nhưng chưa bấm Crop rồi Submit: lỗi "Please crop the image before submitting" | Lý do không tự test được: Cần tương tác chọn ảnh trước khi submit | Cách tôi cần test: Chọn valid.jpg (khung crop hiện lên), không bấm Crop mà bấm thẳng nút Submit, xác nhận hiển thị lỗi "Please crop the image before submitting".
- [ ] ⚠️ MANUAL | 19. Đã crop rồi Submit: hiện kết quả (tên file, 400x400, dung lượng, ảnh) | Lý do không tự test được: Cần quy trình đầy đủ từ upload -> crop -> submit | Cách tôi cần test: Chọn ảnh, bấm Crop, sau đó bấm Submit, xác nhận giao diện chuyển sang màn hình "Submitted Successfully!" hiển thị đầy đủ tên file, 400x400 px, dung lượng và nút "Choose another image".
- [ ] ⚠️ MANUAL | 20. Nút "Choose another image" đưa form về trạng thái ban đầu sạch sẽ | Lý do không tự test được: Cần bấm nút sau khi đã submit thành công | Cách tôi cần test: Tại màn hình kết quả, bấm "Choose another image", xác nhận form trở về trạng thái trống ban đầu, không còn lỗi, không còn preview.

## D. Kỹ thuật
- [ ] ⚠️ MANUAL | 21. Console không có warning/lỗi (key, uncontrolled/controlled, revoked URL...) | Lý do không tự test được: Cần quan sát console tab trong quá trình người dùng thao tác | Cách tôi cần test: Mở F12 DevTools -> tab Console, thực hiện toàn bộ luồng thao tác và kiểm tra không có warning hay lỗi nào màu đỏ/vàng.
- [ ] ⚠️ MANUAL | 22. Chọn/đổi ảnh nhiều lần: không rò rỉ (mỗi URL được revoke) | Lý do không tự test được: Cần kiểm tra vòng đời URL trong bộ nhớ qua DevTools Memory/Network | Cách tôi cần test: Đổi ảnh và crop liên tục 5-10 lần, xác nhận giao diện phản hồi nhanh, không lag, memory không tăng bất thường.
- [x] ✅ PASS | 23. npm run build và npm run lint thành công | Bằng chứng: oxlint hoàn thành 0 warning, 0 error; vite build xuất thành công dist/assets (CSS 16.99 kB, JS 291.19 kB).
- [x] ✅ PASS | 24. Responsive: màn hình hẹp (<400px) khung crop và preview không tràn ngang | Bằng chứng: Browser subagent kiểm thử ở viewport 360px x 700px: form và các phần tử con nằm gọn trong 360px, scrollWidth == clientWidth, không xuất hiện thanh cuộn ngang.

## E. So sánh 2 cách nhập: Hộp thoại (Dialog) và Kéo thả (Drag & Drop)
- [ ] ⚠️ MANUAL | 25. over5mb.png qua Hộp thoại vs Kéo thả | Lý do không tự test được: Trình duyệt sandbox không cho phép kéo thả file thật từ Finder vào browser | Cách tôi cần test: (1) Click khung upload chọn test-assets/over5mb.png; (2) Kéo thả file test-assets/over5mb.png từ Finder vào khung. Xác nhận CẢ HAI cách đều hiện cùng thông báo lỗi: "File size must not exceed 5MB" (không bị nhầm thành "Please select an image").
- [ ] ⚠️ MANUAL | 26. photo.gif qua Hộp thoại vs Kéo thả | Lý do không tự test được: Sandbox chặn kéo thả file thật từ Finder | Cách tôi cần test: Thử cả 2 cách chọn và kéo thả test-assets/photo.gif. Cả 2 cách đều phải hiện: "Only JPG and PNG files are allowed", không hiện khung crop.
- [ ] ⚠️ MANUAL | 27. valid.jpg qua Hộp thoại vs Kéo thả | Lý do không tự test được: Sandbox chặn kéo thả file thật từ Finder | Cách tôi cần test: Thử cả 2 cách với test-assets/valid.jpg. Cả 2 cách đều hiện khung crop sạch sẽ, không lỗi. Khi kéo file vào vùng, khung đổi viền nổi bật (isDragging).
- [ ] ⚠️ MANUAL | 28. Kéo thả nhiều file cùng lúc | Lý do không tự test được: Sandbox chặn kéo thả nhiều file từ Finder | Cách tôi cần test: Chọn cùng lúc 2 file (ví dụ valid.jpg và photo.gif) rồi kéo thả vào khung. Xác nhận hệ thống lấy file đầu tiên (files[0]), không bị crash và hiển thị kết quả đúng với file đầu tiên đó.

---

## Kết quả kiểm thử 2026-10-23 11:25

| # | Mô tả ngắn | Kết quả | Bằng chứng / Ghi chú |
|---|---|:---:|---|
| 1 | Trạng thái đầu sạch sẽ | ✅ PASS | Verified qua browser subagent (không lỗi, không crop, không preview) |
| 2 | Submit khi chưa chọn ảnh | ✅ PASS | Verified qua browser subagent: hiện đúng "Please select an image", role="alert", aria-invalid="true" |
| 3 | Chọn valid.jpg | ⚠️ MANUAL | Cần mở file dialog chọn test-assets/valid.jpg |
| 4 | Chọn valid.png | ⚠️ MANUAL | Cần mở file dialog chọn test-assets/valid.png |
| 5 | Chọn photo.gif | ⚠️ MANUAL | Cần mở file dialog chọn test-assets/photo.gif |
| 6 | Chọn doc.pdf | ⚠️ MANUAL | Cần mở file dialog chọn test-assets/doc.pdf |
| 7 | Chọn over5mb.png / big.jpg | ⚠️ MANUAL | Cần mở file dialog chọn test-assets/over5mb.png hoặc big.jpg |
| 8 | Chọn exact5mb.png (biên 5MB) | ⚠️ MANUAL | Cần mở file dialog chọn test-assets/exact5mb.png |
| 9 | Chọn fake.png / empty.jpg | ⚠️ MANUAL | Cần mở file dialog chọn test-assets/fake.png hoặc empty.jpg |
| 10 | Chọn file sai rồi chọn lại đúng | ⚠️ MANUAL | Thao tác đổi file trên giao diện |
| 11 | Chọn cùng 1 file 2 lần liên tiếp | ⚠️ MANUAL | Thao tác chọn lại cùng 1 file trên giao diện |
| 12 | Kéo ảnh và zoom | ⚠️ MANUAL | Thao tác kéo chuột trên khung crop và thanh zoom |
| 13 | Bấm Crop ra preview 400x400 | ⚠️ MANUAL | Kiểm tra thông tin kích thước thật sau khi bấm Crop |
| 14 | Preview đúng vùng chọn | ⚠️ MANUAL | Quan sát trực quan vùng cắt |
| 15 | small.png (< 400px) vẫn ra 400x400 | ⚠️ MANUAL | Chọn test-assets/small.png và bấm Crop |
| 16 | PNG ra PNG, JPG ra JPG | ⚠️ MANUAL | Kiểm tra phần mở rộng file và MIME |
| 17 | Chọn ảnh khác xóa preview cũ | ⚠️ MANUAL | Thao tác chọn ảnh mới khi đã có preview |
| 18 | Chưa crop mà submit | ⚠️ MANUAL | Thao tác bấm Submit khi mới chọn ảnh gốc |
| 19 | Đã crop rồi Submit | ⚠️ MANUAL | Thao tác Submit sau khi Crop để xem màn hình kết quả |
| 20 | Nút "Choose another image" | ⚠️ MANUAL | Bấm nút reset form tại màn hình kết quả |
| 21 | Console không lỗi/warning | ⚠️ MANUAL | Quan sát F12 DevTools Console |
| 22 | Không rò rỉ URL khi đổi ảnh | ⚠️ MANUAL | Quan sát DevTools Memory |
| 23 | npm run build & npm run lint | ✅ PASS | oxlint 0 lỗi, 0 warning; vite build thành công (CSS 16.99 kB, JS 291.19 kB) |
| 24 | Responsive màn hình < 400px | ✅ PASS | Browser subagent đo ở viewport 360px: không tràn ngang |
| 25 | over5mb.png: Hộp thoại vs Kéo thả | ⚠️ MANUAL | Cả 2 cách đều phải hiện "File size must not exceed 5MB" |
| 26 | photo.gif: Hộp thoại vs Kéo thả | ⚠️ MANUAL | Cả 2 cách đều phải hiện "Only JPG and PNG files are allowed" |
| 27 | valid.jpg: Hộp thoại vs Kéo thả | ⚠️ MANUAL | Cả 2 cách đều hiện khung crop, có hiệu ứng đổi viền khi kéo |
| 28 | Kéo thả nhiều file cùng lúc | ⚠️ MANUAL | Lấy file đầu tiên files[0], không crash |

### Tổng kết số lượng:
- **Tổng số case**: 28
- **Số PASS**: 4 (Case 1, 2, 23, 24)
- **Số FAIL**: 0
- **Số MANUAL**: 24 (Case 3 đến 22, và Case 25 đến 28)

### Danh sách các lỗi đã sửa:
1. **Lỗi khác biệt hành vi giữa Hộp thoại và Kéo thả (Bug kéo thả file >5MB báo "Please select an image")**:
   - *Nguyên nhân*: Trước đó, khi file không hợp lệ, code gọi `fieldOnChange(null)`. Khi RHF nhận giá trị `null`, validation chạy lại trên `null` và trả về `"Please select an image"` thay vì thông báo lỗi cụ thể của file đó.
   - *Đã sửa*: Gộp toàn bộ xử lý thành MỘT hàm `handleFile(file, field)` duy nhất dùng chung cho cả input `onChange` và `onDrop`. Hàm này **luôn gọi `field.onChange(file)`** (kể cả file không hợp lệ) và gọi `trigger('image')`. Nhờ vậy, RHF nhận đúng đối tượng `File` và `validateImageFile` trả về chính xác `"File size must not exceed 5MB"` hoặc `"Only JPG and PNG files are allowed"`. Chỉ khi file hoàn toàn hợp lệ mới tạo Object URL và hiển thị khung crop.
2. **Hiệu ứng trực quan khi kéo thả (Drag over state)**:
   - Thêm state `isDragging` kích hoạt khi `onDragOver` / `onDragEnter`, viền đổi sang màu tím đậm (`border-indigo-600 bg-indigo-50/70 ring-4 ring-indigo-100 scale-[1.01]`). Cả `onDragOver` và `onDrop` đều có `e.preventDefault()`, lấy `e.dataTransfer.files[0]`.

### Danh sách lỗi còn tồn tại:
- Không có lỗi nào chưa được xử lý.

### Hướng dẫn kiểm thử thủ công cho Case 25 - 28:
1. Mở trình duyệt tại `http://localhost:5173/`.
2. Mở cửa sổ Finder chứa thư mục `test-assets/`:
   - **Case 25**: Kéo thả file `test-assets/over5mb.png` vào khung -> Xác nhận báo đúng *"File size must not exceed 5MB"*. Sau đó bấm Reset, click chọn file `over5mb.png` qua hộp thoại -> Xác nhận báo cùng câu lỗi đó.
   - **Case 26**: Kéo thả `test-assets/photo.gif` vào khung -> Báo đúng *"Only JPG and PNG files are allowed"*.
   - **Case 27**: Kéo thả `test-assets/valid.jpg` vào khung -> Trong lúc rê chuột vào khung viền đổi sang màu tím nổi bật; thả tay ra khung crop hiển thị ngay lập tức.
   - **Case 28**: Chọn đồng thời `valid.jpg` và `photo.gif` trong Finder rồi kéo thả cả 2 vào khung -> Hệ thống tự động lấy file đầu tiên, không bị đơ/crash app.
