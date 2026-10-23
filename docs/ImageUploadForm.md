# Đề bài
Create a React component using React Hook Form that includes a form with the following fields:
- Upload Image (required, Type: JPG, PNG, Size: Max 5M)
- Crop image (400 pixel x 400 pixel)
- Preview Image
Include validation messages for a field.

# Quyết định thiết kế
- "5M" = 5 * 1024 * 1024 byte. Đúng 5MB hợp lệ; vượt 1 byte là lỗi.
- Loại file hợp lệ: image/jpeg, image/png (đuôi .jpg, .jpeg, .png). GIF/WebP/HEIC/PDF... bị từ chối.
- Crop tỉ lệ 1:1; kết quả LUÔN đúng 400x400 px. Ảnh gốc nhỏ hơn 400px vẫn cho phép (canvas phóng lên).
- Luồng: chọn ảnh -> validate -> hiện khung crop (kéo, zoom) -> bấm "Crop" -> hiện Preview 400x400
  -> bấm "Submit".
- Hai field trong RHF: `image` (File gốc) và `croppedImage` (File sau crop).

# Thông báo lỗi (tiếng Anh)
- Chưa chọn ảnh: "Please select an image"
- Sai định dạng: "Only JPG and PNG files are allowed"
- Quá dung lượng: "File size must not exceed 5MB"
- Chưa crop mà submit: "Please crop the image before submitting"
- File ảnh hỏng, không đọc được: "Unable to read this image file"

# Thiết kế component
- ImageUploadForm.jsx: useForm, hai Controller, state cho crop/zoom/croppedAreaPixels/previewUrl,
  onSubmit nhận (data) và hiển thị kết quả (tên file, kích thước, dung lượng, ảnh 400x400)
  ngay trong trang; có nút "Choose another image" để làm lại.
- ImageCropper.jsx: bọc <Cropper> của react-easy-crop (aspect=1, thanh trượt zoom),
  trả croppedAreaPixels qua callback.
- ImagePreview.jsx: hiển thị ảnh đã crop 400x400 và thông tin (kích thước, dung lượng).
- utils/imageValidators.js: export MAX_SIZE, ACCEPTED_TYPES, validateImageFile(file) trả
  true hoặc chuỗi lỗi (dùng làm rule validate của RHF).
- utils/cropImage.js: export async getCroppedFile(imageSrc, pixelCrop, fileName, mimeType)
  trả File 400x400.
- useEffect([file]) tạo object URL cho ảnh gốc và revoke trong cleanup;
  tương tự cho preview của ảnh đã crop.
- Nút Submit disabled khi isSubmitting.
## Tùy chọn cộng điểm (chỉ làm sau khi mọi thứ khác xong)
- Kéo-thả file vào vùng upload (dùng chung validateImageFile).
- Kiểm tra "magic bytes" (JPG: FF D8 FF; PNG: 89 50 4E 47) để chống đổi đuôi giả mạo.

# Giao diện Tailwind (tham khảo)
- Trang: min-h-screen bg-slate-50 flex items-start justify-center p-4 sm:p-8
- Thẻ form: w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg space-y-5
- Vùng upload: rounded-xl border-2 border-dashed border-slate-300 p-6 text-center
  hover:border-indigo-400 aria-invalid:border-red-500
- Khung crop: relative h-80 w-full overflow-hidden rounded-xl bg-slate-900
- Preview: h-[400px] w-[400px] max-w-full rounded-xl border object-cover (hiển thị đúng 400x400)
- Lỗi: text-sm font-medium text-red-600
- Nút chính: rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700
  disabled:opacity-50; nút phụ: rounded-lg border border-slate-300 px-4 py-2.5 hover:bg-slate-100
