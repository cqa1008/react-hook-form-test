/**
 * Hàm tải ảnh từ URL và trả về HTMLImageElement qua Promise.
 * Nếu file hỏng hoặc lỗi giải mã, reject để bắt lỗi ở tầng trên.
 * @param {string} url
 * @returns {Promise<HTMLImageElement>}
 */
export function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => {
      reject(new Error('Unable to read this image file'))
    })
    image.src = url
  })
}

/**
 * Cắt ảnh theo croppedAreaPixels và xuất ra đối tượng File kích thước chuẩn 400x400 px.
 * 
 * Lưu ý điểm dễ sai:
 * - Dùng croppedAreaPixels (tọa độ pixel thực tế trên ảnh gốc) thay vì croppedArea (phần trăm).
 * - Canvas luôn cố định kích thước 400x400 px để đảm bảo đầu ra đúng 400x400 bất kể ảnh gốc.
 * - canvas.toBlob là bất đồng bộ và có thể trả về null trên một số trình duyệt/bộ nhớ hạn chế.
 * - PNG giữ nguyên PNG, JPG xuất chất lượng 0.92 theo yêu cầu thiết kế.
 * 
 * @param {string} imageSrc - Object URL của ảnh gốc
 * @param {{ x: number, y: number, width: number, height: number }} pixelCrop - Tọa độ cắt từ react-easy-crop
 * @param {string} fileName - Tên file gốc để đặt tên file sau crop
 * @param {string} mimeType - Định dạng MIME ('image/jpeg' hoặc 'image/png')
 * @returns {Promise<File>} File ảnh đã crop đúng 400x400 px
 */
export async function getCroppedFile(imageSrc, pixelCrop, fileName = 'cropped-image.jpg', mimeType = 'image/jpeg') {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas 2D context is not supported')
  }

  // Kết quả LUÔN đúng 400x400 px
  canvas.width = 400
  canvas.height = 400

  // Bật chế độ làm mịn ảnh khi phóng to/thu nhỏ
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // Vẽ vùng đã chọn từ ảnh gốc vào khung 400x400 px của canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    400,
    400
  )

  const outputMimeType = mimeType === 'image/png' ? 'image/png' : 'image/jpeg'
  const quality = outputMimeType === 'image/jpeg' ? 0.92 : undefined

  return new Promise((resolve, reject) => {
    // Lưu ý: canvas.toBlob có thể trả về null, cần kiểm tra để tránh crash ngầm
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob failed: unable to create image blob'))
          return
        }

        // Đảm bảo tên file có đuôi mở rộng phù hợp
        const ext = outputMimeType === 'image/png' ? '.png' : '.jpg'
        const baseName = fileName.replace(/\.[^/.]+$/, '')
        const finalName = `${baseName}-cropped${ext}`

        const croppedFile = new File([blob], finalName, {
          type: outputMimeType,
          lastModified: Date.now(),
        })

        resolve(croppedFile)
      },
      outputMimeType,
      quality
    )
  })
}
