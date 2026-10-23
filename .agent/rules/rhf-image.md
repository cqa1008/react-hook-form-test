# Quy tắc cho form upload ảnh
## React Hook Form
- useForm({ defaultValues: { image: null, croppedImage: null } }).
- Mỗi field dùng Controller. <input type="file"> KHÔNG được truyền prop `value`.
  onChange: lấy e.target.files[0] rồi gọi field.onChange(file); sau đó reset e.target.value = ''
  để chọn lại cùng một file vẫn kích hoạt onChange.
- Thẻ <form> có noValidate. Lỗi hiển thị trong thẻ role="alert" từ errors.field?.message.
- Input file có aria-invalid, label gắn htmlFor/id.
- Khi người dùng chọn ảnh mới hoặc xóa ảnh: reset croppedImage về null và xóa lỗi cũ.
## Xử lý ảnh
- Chỉ tạo object URL cho file ĐÃ qua validate.
- Mọi URL.createObjectURL phải có URL.revokeObjectURL trong cleanup của useEffect (hoặc khi thay file).
- Crop dùng croppedAreaPixels của react-easy-crop (tọa độ theo kích thước GỐC của ảnh),
  vẽ vào canvas đúng 400x400 bằng ctx.drawImage(img, x, y, w, h, 0, 0, 400, 400).
- Kết quả crop xuất bằng canvas.toBlob, bọc thành File; PNG giữ PNG, JPG xuất JPG chất lượng 0.92.
- Xử lý lỗi giải mã ảnh (file hỏng): hiện thông báo thân thiện, không để app crash.
