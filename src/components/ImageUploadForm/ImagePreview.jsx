import { useState } from 'react'

/**
 * Hiển thị ảnh đã crop cùng thông tin kích thước thực tế (naturalWidth x naturalHeight) và dung lượng file.
 * @param {Object} props
 * @param {string} props.previewUrl - Object URL của ảnh đã crop
 * @param {File} props.file - Đối tượng File của ảnh đã crop
 */
export default function ImagePreview({ previewUrl, file }) {
  const [naturalDimensions, setNaturalDimensions] = useState(null)

  const handleImageLoad = (e) => {
    // Đọc kích thước thật của ảnh từ thuộc tính naturalWidth và naturalHeight
    setNaturalDimensions({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">Preview (400x400):</h3>
      <div className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-2xl bg-slate-50">
        <img
          src={previewUrl}
          alt="Cropped Preview"
          onLoad={handleImageLoad}
          className="h-[400px] w-[400px] max-w-full rounded-xl border border-slate-200 object-cover shadow-sm bg-white"
        />

        {file && (
          <div className="mt-3 text-center text-xs text-slate-600 space-y-1">
            <p className="font-medium text-slate-800 break-all">{file.name}</p>
            <p>
              Dung lượng: <span className="font-semibold">{formatFileSize(file.size)}</span>
              {' • '}
              Kích thước thực: <span className="font-semibold">
                {naturalDimensions
                  ? `${naturalDimensions.width} x ${naturalDimensions.height} px`
                  : 'Đang đọc...'}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
