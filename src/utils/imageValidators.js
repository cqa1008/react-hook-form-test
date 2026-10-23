// Dung lượng tối đa: 5MB = 5 * 1024 * 1024 byte (5,242,880 bytes)
export const MAX_SIZE = 5 * 1024 * 1024

// Định dạng MIME hợp lệ: JPG và PNG
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

/**
 * Hàm validate file ảnh dùng cho rule `validate` của React Hook Form.
 * - Kiểm tra file có tồn tại
 * - Kiểm tra đúng định dạng JPG/PNG
 * - Kiểm tra dung lượng không vượt quá 5MB
 * @param {File|null} file - File người dùng chọn
 * @returns {true|string} - true nếu hợp lệ, chuỗi lỗi tiếng Anh nếu không hợp lệ
 */
export function validateImageFile(file) {
  if (!file) {
    return 'Please select an image'
  }

  // Lưu ý: mime type của jpg trên trình duyệt thường là 'image/jpeg'
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Only JPG and PNG files are allowed'
  }

  // Dung lượng đúng 5MB (5242880 byte) vẫn hợp lệ; vượt 1 byte là lỗi
  if (file.size > MAX_SIZE) {
    return 'File size must not exceed 5MB'
  }

  return true
}
