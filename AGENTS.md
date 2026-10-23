# Rules cho AI Agent
- Đây là bài test React Hook Form: form upload ảnh, crop 400x400, preview. Code ngắn gọn, dễ giải thích.
- Stack: Vite + React + JavaScript (JSX), react-hook-form v7, react-easy-crop, Tailwind CSS v4.
- Tailwind v4: plugin @tailwindcss/vite + `@import "tailwindcss";` trong src/index.css.
  KHÔNG tạo tailwind.config.js / postcss.config.js, KHÔNG dùng `npx tailwindcss init`.
- Style bằng className của Tailwind, KHÔNG viết file .css riêng cho component. KHÔNG dùng UI library khác.
- KHÔNG cài thêm thư viện: không zod/yup, không thư viện crop khác, không thư viện dropzone.
- Validation tự viết bằng rule `validate` của react-hook-form.
- Đọc docs/PROJECT.md, docs/Q1_ImageUploadForm.md, docs/TEST_CASES.md và .agent/rules/rhf-image.md trước khi code.
- Làm lần lượt theo docs/TASKS.md, xong bước nào tick bước đó.
- Comment tiếng Việt ngắn giải thích các điểm dễ sai: Controller với input file, revokeObjectURL,
  croppedAreaPixels, canvas toBlob.
- Không tự ý thêm tính năng ngoài phạm vi (không upload server, không lưu localStorage).
- Khi xong chạy `npm run build` và `npm run lint`, không được có lỗi.
